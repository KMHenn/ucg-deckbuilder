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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="grid grid-cols-1 gap-3 md:col-span-2">
            <div id="deck" class="h-50 w-full bg-amber-100 dark:bg-amber-950 p-6">
                Your deck.
            </div>
            <div id="card-list" class="h-60 w-full bg-green-100 dark:bg-green-950 p-6">
                Card List
                <div class="flex overflow-y-scroll h-full justify-center mx-auto w-fit">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 w-full justify-center">
                        <div v-for="variant in props.standardVariants" class="w-24 md:w-56" :data-card-id="variant.id">
                            <img :src="variant.thumbnail" :alt="variant.number" :title="variant.number" class="w-24 md:w-56"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-full w-full bg-blue-100 dark:bg-blue-950 p-6">
            <div id="active-card-details" class="">
                Select a card to view variants.
            </div>
        </div>
    </div>
</template>