<script>
export default {
    props: {
        book: { type: Object, required: true },
    },
};
</script>

<template>
    <div>
        <div class="p-1">
            <strong>Mã sách:</strong>
            {{ book._id }}
        </div>
        <div class="p-1">
            <strong>Tên:</strong>
            {{ book.nameBook }}
        </div>
        <div class="p-1">
            <strong>Tác giả:</strong>
            {{ book.author }}
        </div>
        <div class="p-1">
            <strong>Mã nhà xuất bản:</strong>
            {{ book.publisherCode }}
        </div>
        <div class="p-1">
            <strong>Số quyển:</strong>
            {{ book.quantity }}
        </div>
    </div>
</template>