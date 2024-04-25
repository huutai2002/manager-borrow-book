<!-- Header.vue -->
<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <a class="navbar-brand">Ứng dụng Quản lý mượn sách</a>
        <div class="mr-auto navbar-nav">
            <li class="nav-item" v-if="userId && !role">
                <router-link to="/" class="nav-link">
                    Trang chủ
                    <i class="fas fa-home"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="role">
                <router-link to="/admin" class="nav-link">
                    Quản lý sách
                    <i class="fas fa-address-book"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="role">
                <router-link to="/admin/publisher" class="nav-link">
                    Quản lý nhà xuất bản
                    <i class="fas fa-address-book"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="role">
                <router-link to="/admin/require" class="nav-link">
                    Yêu cầu mượn sách
                    <i class="fa-solid fa-circle-exclamation"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="!userId">
                <router-link to="/login" class="nav-link">
                    Đăng nhập
                    <i class="fas fa-key"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="!userId">
                <router-link to="/register" class="nav-link">
                    Đăng ký
                    <i class="fas fa-address-book"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="userId && !role">
                <router-link to="/require" class="nav-link">
                    Yêu cầu mượn sách
                    <i class="fa-solid fa-circle-exclamation"></i>
                </router-link>
            </li>
            <li class="nav-item" v-if="!role">
                <router-link to="/user_privacy" class="nav-link">
                    Điều khoản sử dụng
                    <i class="fa-solid fa-book-open-reader"></i>
                </router-link>
            </li>

        </div>
        <div class="dropdown" v-if="userId">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Xin chào: {{ userId }}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" @click="logout()">Đăng xuất</a></li>
            </ul>
        </div>
    </nav>
</template>
<style></style>
<script>
import userService from '@/services/user.service';

export default {
    data() {
        return {
            userId: null,
            role: null
        };
    },
    created() {
        this.getName();
        this.getRole();
    },
    methods: {
        async getName() {
            const token = localStorage.getItem("token");
            const data = await userService.getInfor(token);
            if (data) {
                const { firstName, lastName } = data;
                this.userId = [firstName, lastName].join(" ")
            } else {
                localStorage.removeItem("token");
            }

        },
        async getRole() {
            const token = localStorage.getItem("token");
            const data = await userService.getInfor(token);
            if (data) {
                this.role = data.role;
            } else {
                localStorage.removeItem("token");
            }

        },
        logout() {
            localStorage.removeItem("token");
            this.userId = null;
            this.$router.push({ name: 'Login' });
        }
    }
}
</script>