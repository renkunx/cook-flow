from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('cookbook', '0235_create_astro_api_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='difficulty',
            field=models.PositiveSmallIntegerField(
                null=True,
                blank=True,
                verbose_name='难度',
                help_text='烹饪难度等级（1-5星）'
            ),
        ),
    ]
