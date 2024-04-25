<template>
    <div v-if="publisher" class="page">
        <h4>Thêm Nhà xuất bản mới</h4>
        <PublisherForm :publisher="publisher" @submit:publisher="createPublisher" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import PublisherForm from "@/components/PublisherForm.vue";
import publisherService from "@/services/publisher.service";
export default {
    components: {
        PublisherForm,
    },
    props: {
        // id: { type: String, required: true },
    },
    data() {
        return {
            publisher: {},
            message: "",
        };
    },
    methods: {
        async createPublisher(data) {
            try {
                await publisherService.create(data);
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