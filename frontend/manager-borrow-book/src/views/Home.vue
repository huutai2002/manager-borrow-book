<template>

    <div class="row page mb-4">

        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>
        <div class="mt-3 col-md-12 mb-5">
            <h2>Thư viện sách</h2>

            <div class="accordion book-item" id="accordionExample">
                <div class="accordion-item" v-for="book in books" :key="book._id">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                            :data-bs-target="'#collapse_' + book._id" aria-expanded="true"
                            :aria-controls="'collapse_' + book._id">
                            {{ book.nameBook }} - {{ book.author }}
                        </button>
                        <div class="btn btn-primary" @click="borrowBook(book._id)">Mượn ngay</div>
                    </h2>
                    <div :id="'collapse_' + book._id" class="accordion-collapse collapse"
                        :class="{ 'show': selectedBook === book._id }" data-bs-parent="#accordionExample">
                        <div class="accordion-body row">
                            <div class="col-md-4 offset-md-1">
                                <div>Giá: {{ book.price }}</div>
                                <div class="">Số quyển: {{ book.quantity }}</div>
                            </div>
                            <div class="col-md-4">
                                <div class="">Nhà xuất bản: {{ getPublisherName(book.publisherCode) }}
                                </div>
                                <div class="">Ngày xuất bản: {{ formatDateTime(book.mfgDate) }}</div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>


</template>

<style scoped>
.page {
    max-width: 900px;
    height: auto;
}

.book-item {

    font-family: 'Roboto', Times, serif;
    font-size: 18px;
}

.thumbnail img {
    width: 100%;
}

.accordion-item {
    border-radius: 5px;
    border: 2px solid #ccc;
    margin-bottom: 5px;
    background-color: white;
}

.accordion-body {
    background-color: white;
    width: 100%;
    margin-left: 1px;
    padding: 10px;
}

.accordion-button {
    border: none;
    width: 80%;
    background-color: white;
}

.accordion-header {
    font-size: 22px;
    border: none;
    display: flex;
    justify-content: space-between;
}

.name {
    font-size: 18px;
}
</style>
<script>
import InputSearch from '@/components/InputSearch.vue';
import userService from '@/services/user.service';
import bookService from "@/services/book.service";
import publisherService from '@/services/publisher.service';
import followService from '@/services/follow.service';
export default {
    components: {
        InputSearch,
        // BookListHome,
    },
    data() {
        return {
            books: [],
            publishers: [],
            userId: null,
            searchText: "",
        };
    },
    mounted() {
        this.getAllBooks();
        this.getAllPublisher();
        // this.refreshList();

    },

    created() {
        this.getUser();
    },
    methods: {
        async getAllBooks() {
            this.books = await bookService.getAll();
        },
        async getUser() {
            const token = localStorage.getItem("token");
            const data = await userService.getInfor(token);
            if (data) {
                this.userId = data._id;
            } else {
                localStorage.removeItem("token");
            }
        },
        formatDateTime(dateTimeString) {
            const date = new Date(dateTimeString);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            return formattedDate;
        },
        async getAllPublisher() {
            this.publishers = await publisherService.getAll();
        },
        getPublisherName(id) {
            const publisher = this.publishers.find(key => key._id === id);
            if (publisher) {
                return `${publisher.name}`;
            }
        },
        async borrowBook(bookId) {
            try {
                // Call followService to borrow the book
                await followService.create({
                    userId: this.userId,
                    bookId: bookId,
                });
                // Update the books list after borrowing
                await this.getAllBooks();
                // Optionally, you can provide some feedback to the user
                alert('Book borrowed successfully!');
            } catch (error) {
                console.error('Error borrowing book:', error.message);
                // Optionally, you can provide some error handling to the user
                alert('Bạn đang mượn một quyển sách khác, vui lòng trả để tiếp tục mượn');
            }
        },
    }
}
</script>