<template>
    <div class="container">
        <h2> <router-link to="/login"><i class="fa-solid fa-arrow-left"></i></router-link> Ứng dụng quản lý mượn sách
        </h2>
        <h3 class="mt-5 title text-center">Đăng ký</h3>
        <form @submit.prevent="registerUser" class="mt-3 mb-3">
            <div class="form-group">
                <label for="firstName">Họ:</label>
                <input type="text" id="firstName" v-model="firstName" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="lastName">Tên:</label>
                <input type="text" id="lastName" v-model="lastName" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="dateOfBirth">Ngày sinh:</label>
                <input type="date" id="dateOfBirth" v-model="dateOfBirth" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="address">Địa chỉ:</label>
                <input type="text" id="address" v-model="address" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="gender">Giới tính:</label>
                <select id="gender" v-model="gender" class="form-control" required>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                </select>
            </div>
            <div class="form-group">
                <label for="phoneNumber">Số điện thoại:</label>
                <input type="text" id="phoneNumber" v-model="phoneNumber" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="password">Mật khẩu:</label>
                <input type="password" id="password" v-model="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary mt-3 mb-4">Đăng ký</button>
        </form>
    </div>
</template>

<script>
import userService from '@/services/user.service'; // Import the userService here

export default {
    data() {
        return {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            address: '',
            gender: '',
            phoneNumber: '',
            password: ''
        };
    },

    methods: {
        async registerUser() {
            try {
                await userService.register({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    dateOfBirth: this.dateOfBirth,
                    address: this.address,
                    gender: this.gender,
                    phoneNumber: this.phoneNumber,
                    password: this.password
                });
                alert('Đăng ký thành công!');
                this.$router.push('/login')
                // Optionally, you can redirect the user to another page after successful registration.
            } catch (error) {
                alert('Đăng ký thất bại. Vui lòng thử lại sau.');
                console.error(error);
            }
        }
    }
};
</script>

<style scoped>
.title {
    color: green;
}
</style>