<script setup lang="ts">
const props=defineProps<{
    standardVariants: { 
        id: number,
        name:string, 
        serial:string,
        number:string,
        thumbnail:string
    }[]
}>()
</script>

<template>
    <div class="grid grid-flow-col grid-rows-2 lg:grid-flow-row lg:grid-cols-2 gap-3 m-auto lg:max-h-[calc(100vh-6rem)]">
        <div id="deck" class="h-fit overflow-y-scroll bg-amber-100 dark:bg-amber-950 py-6">
            Your deck
        </div>
        <div id="card-list" class="flex flex-col h-fit  bg-green-100 dark:bg-green-950 py-6">
            <div class="shrink-0">
            Card List
            </div>
            <div class="shrink-0">
                Search and filtering
            </div>
            <div class="flex-1 max-h-[calc(100vh-10rem)] overflow-y-scroll grid grid-cols-3 bg-green-200 gap-2 lg:gap-3 w-full">
                <div v-for="variant in props.standardVariants" class="flex w-34 lg:w-44 h-34 lg:h-44 bg-green-300 dark:bg-green-600" :data-card-id="variant.id">
                    <img :src="variant.thumbnail" :alt="variant.number" :title="variant.number" class="m-auto w-auto h-auto max-w-34 lg:max-w-44 max-h-34 lg:max-h-44"/>
                </div>
            </div>
        </div>
    </div>
</template>