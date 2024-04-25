<template>
    <div v-if="book" class="page">
        <h4>Thêm Sách mới</h4>
        <BookForm :book="book" @submit:book="createBook" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import bookService from "@/services/book.service";
export default {
    components: {
        BookForm,
    },
    props: {
        // id: { type: String, required: true },
    },
    data() {
        return {
            book: {},
            message: "",
        };
    },
    methods: {
        async createBook(data) {
            try {
                await bookService.create(data);
                alert("Sản phẩm đã được thêm thành công.");

            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        // this.getbook(this.id);
        this.message = "";
    },
};
</script>