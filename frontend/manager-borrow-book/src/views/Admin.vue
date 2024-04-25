<template>

    <div class="row page mb-4">

        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>
        <div class="mt-3 col-md-6 mb-5">
            <h4>
                Sách
                <i class="fas fa-book"></i>
            </h4>
            <BookList v-if="filteredBooksCount > 0" :books="filteredBooks" v-model:activeIndex="activeIndex" />
            <p v-else>Không có liên hệ nào.</p>
            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddBook">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllBooks">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>
        <div class="mt-3 col-md-6">
            <div v-if="activeBook">
                <h4>
                    Chi tiết sách
                    <i class="fas fa-book"></i>
                </h4>
                <BookCard :book="activeBook" />
                <router-link :to="{
                    name: 'book.edit',
                    params: { id: activeBook._id },
                }">
                    <span class="mt-2 badge badge-warning">
                        <i class="fas fa-edit"></i> Hiệu chỉnh</span>
                </router-link>
            </div>
        </div>
    </div>


</template>

<style scoped>
.page {
    max-width: 900px;
}

.book-item {

    font-family: 'Roboto', Times, serif;
}

.thumbnail img {
    width: 100%;
}

.name {
    font-size: 18px;
}
</style>
<script>
import InputSearch from '@/components/InputSearch.vue';
import BookList from '@/components/BookList.vue';
import BookCard from '@/components/BookCard.vue'
import userService from '@/services/user.service';
import bookService from "@/services/book.service";
export default {
    components: {
        InputSearch,
        BookList,
        BookCard
    },
    data() {
        return {
            userId: null, // Khởi tạo userId là null
            books: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    watch: {
        // Giám sát các thay đổi của biến searchText.
        // Bỏ chọn phần tử đang được chọn trong danh sách.
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        bookStrings() {
            return this.books.map((book) => {
                const { nameBook, author, } = book;
                return [nameBook, author].join("");
            });
        },
        filteredBooks() {
            if (!this.searchText) return this.books;
            return this.books.filter((_book, index) =>
                this.bookStrings[index].includes(this.searchText)
            );
        },
        activeBook() {
            if (this.activeIndex < 0) return null;
            return this.filteredBooks[this.activeIndex];
        },
        filteredBooksCount() {
            return this.filteredBooks.length;
        },
    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await bookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        async getName() {
            const token = localStorage.getItem("token");
            const data = await userService.getInfor(token);
            if (data) {
                this.userId = data.firstName;
            } else {
                localStorage.removeItem("token");
            }

        },
        refreshList() {
            this.retrieveBooks();
        },
        async removeAllBooks() {
            if (confirm("Bạn muốn xóa tất cả sách?")) {
                try {
                    await bookService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddBook() {
            this.$router.push({ name: "book.add" });
        },
    },
    mounted() {
        this.refreshList();
    },
}
</script>