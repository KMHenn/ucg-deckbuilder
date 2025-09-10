

<template>
    <div class="h-64 max-h-64 overflow-scroll">
        <ul>
            <li v-for="standardVariant in standardVariants">
                {{ standardVariant.name (standardVariant.serial)}}
            </li>
        </ul>
    </div>
</template>