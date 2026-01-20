from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone
from oauth2_provider.models import AccessToken, Application

User = get_user_model()


class Command(BaseCommand):
    help = 'Create an OAuth2 access token for anonymous API access'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='astro_user',
            help='Username for the API user (default: astro_user)',
        )
        parser.add_argument(
            '--regenerate',
            action='store_true',
            help='Regenerate token if user already exists',
        )

    def handle(self, *args, **options):
        username = options['username']
        regenerate = options['regenerate']

        # 查找或创建用户
        try:
            user = User.objects.get(username=username)
            if regenerate:
                # 删除现有的 token
                AccessToken.objects.filter(user=user).delete()
                self.stdout.write(
                    self.style.WARNING(f'Existing tokens for user "{username}" have been deleted.')
                )
            else:
                # 检查是否已有有效 token
                existing_token = AccessToken.objects.filter(
                    user=user, expires__gt=timezone.now()
                ).first()
                if existing_token:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'User "{username}" already has a valid token:\n{existing_token.token}'
                        )
                    )
                    return
        except User.DoesNotExist:
            # 创建新用户
            user = User.objects.create_user(
                username=username,
                email=f'{username}@cookflow.local',
                password=None,  # 无密码用户
            )
            self.stdout.write(
                self.style.SUCCESS(f'Created new user: {username}')
            )

        # 确保用户是 guest 组成员
        from django.contrib.auth.models import Group
        from cookbook.models import Space
        guest_group, _ = Group.objects.get_or_create(name='guest')
        # 同时添加到 user.groups 和 UserSpace.groups
        user.groups.add(guest_group)

        # 创建或获取 space 并关联用户
        # 首先尝试获取现有的 space（第一个）
        existing_space = Space.objects.first()
        if existing_space:
            space = existing_space
            created = False
        else:
            # 如果没有现有的 space，创建一个新的
            space = Space.objects.create(
                name='Public Space',
                created_by=user,
            )
            created = True
            self.stdout.write(
                self.style.SUCCESS(f'Created new space: {space.name}')
            )

        # 关联用户到 space
        from cookbook.models import UserSpace
        user_space, created = UserSpace.objects.get_or_create(
            user=user,
            space=space,
            defaults={'active': True},
        )
        # 确保 UserSpace 也有 guest 组
        user_space.groups.add(guest_group)
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Associated user "{username}" with space "{space.name}"')
            )

        # 创建或获取 OAuth2 应用
        application, _ = Application.objects.get_or_create(
            name='Astro Public API',
            defaults={
                'client_type': Application.CLIENT_CONFIDENTIAL,
                'authorization_grant_type': Application.GRANT_CLIENT_CREDENTIALS,
                'user': user,
            },
        )

        # 创建访问令牌
        import uuid
        token_string = f'astro_{str(uuid.uuid4()).replace("-", "")}'
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            token=token_string,
            expires=timezone.now() + timezone.timedelta(days=365 * 5),  # 5年有效期
            scope='read write',
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully created API access token:\n'
                f'----------------------------------------\n'
                f'Token: {access_token.token}\n'
                f'User: {user.username}\n'
                f'Expires: {access_token.expires}\n'
                f'Scope: {access_token.scope}\n'
                f'----------------------------------------\n'
                f'\nAdd this to your .env file:\n'
                f'PUBLIC_API_URL=http://localhost:8000\n'
                f'PUBLIC_API_TOKEN={access_token.token}\n'
            )
        )
