<!-- Login.vue -->
<template>
    <header class="mt-3">
        <h2 class="title">Chào mừng đến với Ứng dụng quản lý mượn sách</h2>
    </header>
    <div class="container mt-5 mx-auto login">
        <div class="row">
            <div class="col-md-7">
                <h2 class="mb-4">Đăng nhập</h2>
                <form @submit.prevent="login">
                    <div class="form-group">
                        <label for="username">Số điện thoại</label>
                        <input type="text" class="form-control" v-model="phoneNumber" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mật khẩu:</label>
                        <input type="password" class="form-control" v-model="password" id="password" required>
                    </div>
                    <button class="btn btn-primary" type="submit" @click="login()">Đăng nhập</button>
                </form>
                <p>Bạn chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
            </div>
            <div class="col-md-3 offset-md-2">
                <img src="/src/assets/title.jpg" class="image-tilee" alt="">
                <div class="the-tilee">
                    <p>Một cuốn sách hay cho ta một điều tốt</p>
                    <p>Một người bạn tốt cho ta một điều hay</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import userService from '@/services/user.service';

export default {
    data() {
        return {
            phoneNumber: '',
            password: ''
        };
    },
    methods: {
        async login() {
            try {
                const user = await userService.login(this.phoneNumber, this.password);
                // if (user) {
                const { token } = user;
                localStorage.setItem('token', token);

                const { role } = user;
                if (role) {
                    this.$router.push({ name: 'Admin' });
                } else {
                    this.$router.push({ name: 'Home' });

                }
                // }
                // else {
                //     alert("Số điện thoại hoặc mật khẩu sai!");
                // }
            } catch (error) {
                alert("Số điện thoại hoặc mật khẩu sai!");
                console.log(error);
            }
        }
    }
}
</script>
<style scoped>
.the-tilee {
    width: 100%;
    padding: 30px;
    /* border: 2px #ccc solid; */
    font-family: 'Times New Roman', Times, serif;
    font-size: larger;

}

.title {
    color: green;
}

.image-tilee {
    width: 100%;
}
</style>