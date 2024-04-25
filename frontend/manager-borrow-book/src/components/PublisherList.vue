<script>
export default {
    props: {
        publishers: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        }
    }
};
</script>

<template>
    <ul class="list-group">
        <li class="list-group-item" v-for="(publisher, index) in publishers" :key="publisher._id"
            :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
            {{ publisher.name }}
        </li>
    </ul>
</template>