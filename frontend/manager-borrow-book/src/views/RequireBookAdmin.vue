<template>
    <h3>Quản lý mượn sách</h3>
    <div class="btn btn-primary" @click="refesh()">Làm mới <i class="fa-solid fa-arrows-rotate"></i></div>
    <div class="row page mt-4">
        <table class="mb-5 table table-success table-striped table-hover table-bordered table-sm">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Người mượn</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Ngày yêu cầu</th>
                    <th scope="col">Ngày mượn</th>
                    <th scope="col">Hạn trả</th>
                    <th scope="col">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(follow, index) in follows" :key="follow._id">
                    <td>{{ index + 1 }}</td>
                    <!-- <div v-for="user in users" :key="user._id">
                        <td v-if="user._id === follow.userId">{{ user.firstName }} {{ user.lastName }}</td>

                    </div> -->
                    <td>{{ getUserName(follow.userId) }}</td>
                    <!-- <div v-for="book in books" :key="book._id">
                        <td v-if="book._id === follow.bookId">{{ book.nameBook }}</td>
                    </div> -->
                    <td>{{ getBookName(follow.bookId) }}</td>
                    <td>{{ formatDateTime(follow.requireDate) }}</td>


                    <!-- <td>{{ formatDateTime(follow.borrowDate) }}</td> -->
                    <td>
                        <span v-if="follow.borrowDate">{{ formatDateTime(follow.borrowDate) }}</span>
                        <span v-else>&nbsp;</span>
                    </td>
                    <td>
                        <span v-if="follow.returnDate">{{ formatDateTime(follow.returnDate) }}</span>
                        <span v-else>&nbsp;</span>
                    </td>
                    <td>
                        <select class="form-select" v-model="follow.status" @change="updateStatus(follow._id, follow)">
                            <option value="Gửi yêu cầu">Gửi yêu cầu</option>
                            <option value="Chấp nhận">Chấp nhận</option>
                            <option value="Đã hoàn trả">Đã hoàn trả</option>
                        </select>
                    </td>
                    <!-- <td>{{ formatDateTime(follow.returnDate) }}</td> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
.page {
    max-width: 1000px;
    height: auto;
}
</style>
<script>
import InputSearch from '@/components/InputSearch.vue';
import userService from '@/services/user.service';
import bookService from "@/services/book.service";
import followService from "@/services/follow.service";
import publisherService from '@/services/publisher.service';
export default {
    components: {
        InputSearch,
    },
    data() {
        return {
            follows: [],
            users: [],
            books: [],
            publishers: [],
            nameBook: null,
            selected: ""
        };
    },
    mounted() {
        this.getAllFollows();
        this.getAllPublisher();
        this.getAllBook();
        this.getAllUser();
        this.refesh()
    },
    methods: {
        async getAllFollows() {
            this.follows = await followService.getAll();
        },
        formatDateTime(dateTimeString) {
            const date = new Date(dateTimeString);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            return formattedDate;
        },
        async getAllPublisher() {
            this.publishers = await publisherService.getAll();
        },
        async getAllBook() {
            this.books = await bookService.getAll();
        },
        async getAllUser() {
            this.users = await userService.getAll();
        },
        getPublisher(id) {
            return this.publishers.find(data => data._id == id);
        },
        getBookName(id) {
            const book = this.books.find(key => key._id === id);
            if (book) {
                return `${book.nameBook}`;
            }
        },
        getUserName(id) {
            const user = this.users.find(key => key._id === id);
            if (user) {
                return `${user.firstName} ${user.lastName}`;
            }
        },
        async updateStatus(id, data) {
            const confirmed = confirm("Bạn có chắc chắn muốn cập nhật trạng thái không?");
            // Chỉ gọi updateStatus nếu người dùng xác nhận
            if (confirmed) {
                // Tính toán ngày trả bằng cách cộng thêm 14 ngày từ ngày hiện tại
                const returnDate = new Date();
                returnDate.setDate(returnDate.getDate() + 14);
                const update = await followService.update(id, {
                    bookId: data.bookId,
                    userId: data.userId,
                    borrowDate: new Date(),
                    returnDate: returnDate,
                    requireDate: data.requireDate,
                    status: data.status
                });

                if (update) {
                    alert("Cập nhật thành công trạng thái!")
                } else {
                    alert("Lỗi cập nhật trạng thái!")

                }
            } else {
                this.getAllFollows();
            }
        },
        refesh() {
            this.getAllFollows();
        }
    }
}
</script>