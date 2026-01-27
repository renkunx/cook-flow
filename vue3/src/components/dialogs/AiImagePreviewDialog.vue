<template>
    <v-dialog max-width="800px" v-model="dialog">
        <v-card>
            <v-card-title>{{ $t('AI_Generated_Image_Preview') }}</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" class="text-center">
                        <v-img
                            :src="generatedImageUrl"
                            max-height="400px"
                            contain>
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </v-col>
                    <v-col cols="12">
                        <v-label>{{ $t('Prompt_Used') }}</v-label>
                        <v-textarea
                            v-model="promptUsed"
                            readonly
                            rows="4"
                            density="compact">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12" v-if="providerInfo">
                        <v-alert type="info" density="compact" variant="tonal">
                            <div>{{ $t('Prompt_AI') }}: {{ providerInfo.promptProvider }}</div>
                            <div>{{ $t('Image_AI') }}: {{ providerInfo.imageProvider }} ({{ providerInfo.imageModel }})</div>
                        </v-alert>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="handleCancel" :disabled="loading">{{ $t('Cancel') }}</v-btn>
                <v-btn @click="handleRegenerate" :loading="loading">
                    {{ $t('Regenerate') }}
                </v-btn>
                <v-btn color="success" @click="handleSave" :loading="loading">
                    {{ $t('Save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dialog = defineModel<boolean>({ required: true });
const emit = defineEmits(['save', 'regenerate', 'cancel']);

const generatedImageUrl = ref('');
const promptUsed = ref('');
const providerInfo = ref<{ promptProvider: string; imageProvider: string; imageModel: string } | null>(null);
const loading = ref(false);

function showPreview(data: {
    image_url: string;
    prompt_used: string;
    prompt_provider: string;
    image_provider: string;
    image_model: string;
}) {
    generatedImageUrl.value = data.image_url;
    promptUsed.value = data.prompt_used;
    providerInfo.value = {
        promptProvider: data.prompt_provider,
        imageProvider: data.image_provider,
        imageModel: data.image_model,
    };
    dialog.value = true;
    loading.value = false;
}

function handleSave() {
    emit('save', {
        url: generatedImageUrl.value,
        prompt: promptUsed.value,
    });
    dialog.value = false;
}

function handleRegenerate() {
    emit('regenerate');
    loading.value = true;
}

function handleCancel() {
    dialog.value = false;
    emit('cancel');
}

function setLoading(isLoading: boolean) {
    loading.value = isLoading;
}

defineExpose({
    showPreview,
    setLoading,
});
</script>
