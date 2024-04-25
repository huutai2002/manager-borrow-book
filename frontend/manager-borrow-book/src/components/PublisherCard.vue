<script>
export default {
    props: {
        publisher: { type: Object, required: true },
    },
};
</script>

<template>
    <div>
        <div class="p-1">
            <strong>Mã nhà xuất bản:</strong>
            {{ publisher._id }}
        </div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ publisher.name }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ</strong>
            {{ publisher.address }}
        </div>
    </div>

</template>