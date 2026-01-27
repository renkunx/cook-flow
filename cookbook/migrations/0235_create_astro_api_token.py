# Generated migration for creating astro API user and token

from django.db import migrations
from django.utils import timezone
from datetime import timedelta


def create_astro_user_and_token(apps, schema_editor):
    """
    Create astro user and OAuth2 access token for API access.
    This migration is safe to run multiple times.
    """
    User = apps.get_model('auth', 'User')
    Application = apps.get_model('oauth2_provider', 'Application')
    AccessToken = apps.get_model('oauth2_provider', 'AccessToken')
    Space = apps.get_model('cookbook', 'Space')
    UserSpace = apps.get_model('cookbook', 'UserSpace')
    Group = apps.get_model('auth', 'Group')

    # Get or create astro user
    astro_user, created = User.objects.get_or_create(
        username='astro',
        defaults={
            'email': 'astro@cookflow.local',
            'is_active': True,
        }
    )

    # Get or create default space
    default_space = Space.objects.first()
    if not default_space:
        default_space = Space.objects.create(
            name='Default Space',
            created_by=astro_user
        )

    # Get or create guest group
    guest_group, _ = Group.objects.get_or_create(
        name='guest',
        defaults={'description': 'Guest users with read-only access'}
    )

    # Add astro user to guest group
    if guest_group not in astro_user.groups.all():
        astro_user.groups.add(guest_group)

    # Create UserSpace to associate user with space
    user_space, created = UserSpace.objects.get_or_create(
        user=astro_user,
        space=default_space,
        defaults={'active': True},
    )

    # Ensure UserSpace has guest group
    if guest_group not in user_space.groups.all():
        user_space.groups.add(guest_group)

    # Create OAuth2 application
    application, _ = Application.objects.get_or_create(
        name='Astro Frontend',
        defaults={
            'client_type': 'confidential',
            'authorization_grant_type': 'client-credentials',
            'user': astro_user,
        }
    )

    # Create or update access token (expires in 5 years)
    expires = timezone.now() + timedelta(days=365 * 5)
    token_string = 'astro_dc287a83562f4a19ae9803871de4c436'

    # Delete old tokens for this user
    AccessToken.objects.filter(user=astro_user).delete()

    # Create new token
    AccessToken.objects.create(
        user=astro_user,
        token=token_string,
        application=application,
        expires=expires,
        scope='read write'
    )


def reverse_func(apps, schema_editor):
    """
    Reverse migration - clean up astro user and token.
    """
    User = apps.get_model('auth', 'User')
    Application = apps.get_model('oauth2_provider', 'Application')
    AccessToken = apps.get_model('oauth2_provider', 'AccessToken')
    UserSpace = apps.get_model('cookbook', 'UserSpace')

    # Delete astro access tokens
    AccessToken.objects.filter(user__username='astro').delete()

    # Delete astro application
    Application.objects.filter(user__username='astro').delete()

    # Delete astro UserSpace
    UserSpace.objects.filter(user__username='astro').delete()

    # Optionally delete astro user
    User.objects.filter(username='astro').delete()


class Migration(migrations.Migration):
    dependencies = [
        ('cookbook', '0234_alter_shoppinglist_options_and_more'),
        ('oauth2_provider', '0001_initial'),
        ('auth', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_astro_user_and_token, reverse_func),
    ]
