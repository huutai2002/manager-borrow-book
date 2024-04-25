import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Admin from "@/views/Admin.vue";
import Login from "@/views/Login.vue";
import Product from "@/views/Product.vue";
import RequireBook from "@/views/RequireBook.vue";
import Publisher from "@/views/Publisher.vue";
import userService from "@/services/user.service";
import RequireBookAdmin from "@/views/RequireBookAdmin.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }, // Đánh dấu trang Home cần xác thực
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAuth: true, isAdmin: true }, // Đánh dấu trang Admin cần xác thực và quyền admin
  },
  {
    path: "/admin/publisher",
    name: "Publisher",
    component: Publisher,
    meta: { requiresAuth: true, isAdmin: true }, // Đánh dấu trang Publisher cần xác thực và quyền admin
  },
  {
    path: "/admin/require",
    name: "RequireAdmin",
    component: RequireBookAdmin,
    meta: { requiresAuth: true, isAdmin: true }, // Đánh dấu trang Publisher cần xác thực và quyền admin
  },
  {
    path: "/admin/publisher/:id",
    name: "publisher.edit",
    component: () => import("@/views/EditPublisher.vue"),
    meta: { requiresAuth: true, isAdmin: true },
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/admin/publishers",
    name: "publisher.add",
    meta: { requiresAuth: true, isAdmin: true }, // Đánh dấu trang Add Publisher cần xác thực và quyền admin
    component: () => import("@/views/AddPublisher.vue"),
  },
  {
    path: "/book/:id",
    name: "book.edit",
    component: () => import("@/views/EditBook.vue"),
    meta: { requiresAuth: true, isAdmin: true }, // Đánh dấu trang Edit Book cần xác thực (không yêu cầu quyền admin)
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/books",
    name: "book.add",
    meta: { requiresAuth: true, isAdmin: true }, // Đánh dấu trang Add Book cần xác thực (không yêu cầu quyền admin)
    component: () => import("@/views/AddBook.vue"),
  },
  { path: "/product/:id", component: Product, meta: { requiresAuth: true } }, // Đánh dấu trang Product cần xác thực
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/require",
    name: "Require",
    component: RequireBook,
    meta: { requiresAuth: true }, // Đánh dấu trang Require Book cần xác thực
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    debugger;
    if (!isAuthenticated()) {
      next({ name: "Login" }); // Chuyển hướng đến trang đăng nhập nếu không có token
    } else {
      const token = localStorage.getItem("token");
      const isAdmin1 = await userService.getInfor(token);
      const { role } = isAdmin1;
      if (role && to.matched.some((record) => record.meta.isAdmin)) {
        // Nếu là admin và route yêu cầu quyền admin
        next();
      } else if (!role && to.matched.some((record) => !record.meta.isAdmin)) {
        // Nếu không phải admin và route không yêu cầu quyền admin
        next();
      } else {
        // Ngược lại, chuyển hướng đến trang không có quyền truy cập
        next({ name: "notfound" });
      }
    }
  } else {
    next();
  }
});

function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}
async function isAdmin() {
  const token = localStorage.getItem("token");
  const user = await userService.getInfor(token);
  return user.role;
}

export default router;
