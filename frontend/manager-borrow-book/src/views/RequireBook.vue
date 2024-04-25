<template>
    <h3>Yêu cầu mượn sách</h3>
    <div class="row page">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Ngày yêu cầu</th>
                    <th scope="col">Ngày mượn</th>
                    <th scope="col">Ngày phải trả</th>
                    <th scope="col">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="follow in follows" :key="follow._id">
                    <td>1</td>
                    <div v-for="book in books" :key="book._id">
                        <td v-if="book._id === follow.bookId">{{ book.nameBook }}</td>
                    </div>
                    <td>{{ convertTime(follow.requireDate) }}</td>
                    <!-- <td>{{ follows.borrowDate }}</td> -->
                    <td>
                        <span v-if="follow.borrowDate">{{ convertTime(follow.borrowDate) }}</span>
                        <span v-else>&nbsp;</span>
                    </td>
                    <td>
                        <span v-if="follow.returnDate">{{ convertTime(follow.returnDate) }}</span>
                        <span v-else>&nbsp;</span>
                    </td>
                    <!-- <td>{{ follows.returnDate }}</td> -->
                    <td>{{ follow.status }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
.page {
    max-width: 800px;
}
</style>
<script>
import followService from "@/services/follow.service";
import userService from "@/services/user.service";
import bookService from "@/services/book.service"
export default {
    data() {
        return {
            follows: [],
            userId: null,
            books: []
        }
    },
    mounted() {
        this.getFollows();
        this.getAllBooks();
    },
    methods: {
        async getAllBooks() {
            this.books = await bookService.getAll();
        },
        async getFollows() {
            const token = localStorage.getItem("token");
            const data = await userService.getInfor(token);
            this.userId = data._id;
            this.follows = await followService.getByUser(data._id);
        },
        convertTime(originalTimeString) {
            // Chuyển đổi chuỗi thời gian ban đầu sang đối tượng Date
            const date = new Date(originalTimeString);

            // Lấy các thành phần của ngày và giờ
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            // const hours = date.getHours().toString().padStart(2, "0");
            // const minutes = date.getMinutes().toString().padStart(2, "0");

            // Tạo chuỗi định dạng mới
            const formattedTimeString = `${day}/${month}/${year}`;

            // Trả về chuỗi đã được định dạng
            return formattedTimeString;
        }
    }
}

</script>