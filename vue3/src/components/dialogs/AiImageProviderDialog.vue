<template>
    <v-dialog max-width="500px" v-model="dialog">
        <v-card>
            <v-card-title>{{ $t('AI_Generate_Image') }}</v-card-title>
            <v-card-text>
                <v-alert type="info" density="compact" class="mb-4">
                    {{ $t('AI_Image_Provider_Help') }}
                </v-alert>
                <v-select
                    :label="$t('Prompt_AI')"
                    v-model="promptProviderId"
                    :items="availableProviders"
                    item-title="name"
                    item-value="id"
                    hint="用于分析和优化图像描述"
                    persistent-hint
                    :disabled="loading">
                    <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                            <v-list-item-subtitle>
                                {{ item.raw.model_name }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </template>
                </v-select>
                <v-select
                    :label="$t('Image_AI')"
                    v-model="imageProviderId"
                    :items="availableProviders"
                    item-title="name"
                    item-value="id"
                    hint="用于生成图片"
                    persistent-hint
                    :disabled="loading">
                    <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                            <v-list-item-subtitle>
                                {{ item.raw.model_name }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </template>
                </v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false" :disabled="loading">{{ $t('Cancel') }}</v-btn>
                <v-btn
                    color="primary"
                    @click="startGeneration"
                    :loading="loading"
                    :disabled="!promptProviderId || !imageProviderId">
                    {{ $t('Generate') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { AiProvider, ApiApi } from '@/openapi';
import { ErrorMessageType, useMessageStore } from '@/stores/MessageStore.ts';

const dialog = defineModel<boolean>({ required: true });
const emit = defineEmits(['generate']);

const availableProviders = ref<AiProvider[]>([]);
const promptProviderId = ref<number | null>(null);
const imageProviderId = ref<number | null>(null);
const loading = ref(false);

const api = new ApiApi();

onMounted(() => {
    loadProviders();
});

async function loadProviders() {
    try {
        const response = await api.apiAiProviderList();
        availableProviders.value = response.results || [];
    } catch (err) {
        useMessageStore().addError(ErrorMessageType.FETCH_ERROR, err);
    }
}

function startGeneration() {
    if (promptProviderId.value && imageProviderId.value) {
        emit('generate', {
            promptProviderId: promptProviderId.value,
            imageProviderId: imageProviderId.value,
        });
        loading.value = true;
    }
}

function setLoading(isLoading: boolean) {
    loading.value = isLoading;
}

function reset() {
    loading.value = false;
}

defineExpose({
    setLoading,
    reset,
});
</script>

<style scoped>
</style>
