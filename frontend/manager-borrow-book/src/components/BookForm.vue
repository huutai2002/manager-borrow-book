<template>
    <Form @submit="submitBook" :validation-schema="bookFormSchema">
        <div class="form-group">
            <label for="name">Tên</label>
            <Field name="name" type="text" class="form-control" v-model="bookLocal.nameBook" />
            <ErrorMessage name="nameBook" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="author">Tác giả</label>
            <Field name="author" type="text" class="form-control" v-model="bookLocal.author" />
            <ErrorMessage name="author" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="quantity">Số quyển</label>
            <Field name="quantity" type="number" class="form-control" v-model="bookLocal.quantity" />
            <ErrorMessage name="quantity" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="price">Giá</label>
            <Field name="price" type="number" class="form-control" v-model="bookLocal.price" />
            <ErrorMessage name="price" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="publisherCode">Nhà xuất bản</label>
            <Field as="select" name="publisherCode" class="form-control" v-model="bookLocal.publisherCode" required>
                <option value="">-----Chọn nhà xuất bản----</option>
                <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id"
                    :selected="bookLocal.publisherCode == publisher._id">
                    {{ publisher.name }}
                </option>
            </Field>
            <ErrorMessage name="publisherCode" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="mfgDate">Ngày xuất bản</label>
            <Field name="mfgDate" type="date" class="form-control" v-model="bookLocal.mfgDate" />
            <ErrorMessage name="mfgDate" class="error-feedback" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary" @click="submitBook">Lưu</button>
            <button v-if="bookLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteBook">
                Xóa
            </button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import publisherService from "@/services/publisher.service";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:book", "delete:book"],
    props: {
        book: { type: Object, required: true }
    },
    data() {
        const bookFormSchema = yup.object().shape({
            nameBook: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(10, "Tên phải ít nhất 10 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            author: yup
                .string()
                .min(10, "Tên phải ít nhất 10 ký tự.")
                .max(50, "Tên tối đa 50 ký tự.")
                .required("Tên phải có giá trị."),
            quantity: yup.number().required(),
            price: yup
                .number()
                .min(1000)
                .required("Vui lòng nhập giá"),
            publisherCode: yup
                .string()
                .required("Vui lòng chọn nhà xuất bản"),
            mfgDate: yup
                .date()
                .required("Vui lòng nhập ngày xuất bản"),
        });
        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // contactLocal để liên kết với các input trên form
            bookLocal: this.book,
            bookFormSchema,
            publishers: [],

        };
    },
    mounted() {
        this.getAllPublisher();
    },
    methods: {
        submitBook() {
            this.$emit("submit:book", this.bookLocal);
        },
        deleteBook() {
            this.$emit("delete:book", this.bookLocal.id);
        },
        async getAllPublisher() {
            this.publishers = await publisherService.getAll();
        }
    },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
