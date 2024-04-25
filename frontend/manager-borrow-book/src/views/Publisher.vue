<template>
    <div class="row page mb-4">

        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>
        <div class="mt-3 col-md-6 mb-5">
            <h4>
                Nhà xuất bản
                <i class="fas fa-book"></i>
            </h4>
            <PublisherList v-if="filteredPublishersCount > 0" :publishers="filteredPublishers"
                v-model:activeIndex="activeIndex" />
            <p v-else>Không có liên hệ nào.</p>
            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>
                <button class="btn btn-sm btn-success" @click="goToAddPublisher">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllPublishers">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>
        <div class="mt-3 col-md-6">
            <div v-if="activePublisher">
                <h4>
                    Chi tiết Nhà xuất bản
                    <i class="fas fa-book"></i>
                </h4>
                <PublisherCard :publisher="activePublisher" />
                <router-link :to="{
                    name: 'publisher.edit',
                    params: { id: activePublisher._id },
                }">
                    <span class="mt-2 badge badge-warning">
                        <i class="fas fa-edit"></i> Hiệu chỉnh</span>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import InputSearch from '@/components/InputSearch.vue';
import PublisherList from '@/components/PublisherList.vue';
import PublisherCard from '@/components/PublisherCard.vue'
import userService from '@/services/user.service';
import publisherService from "@/services/publisher.service";
export default {
    components: {
        InputSearch,
        PublisherList,
        PublisherCard
    },
    data() {
        return {
            userId: null, // Khởi tạo userId là null
            publishers: [],
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
        publisherStrings() {
            return this.publishers.map((publisher) => {
                const { namePublisher, author, } = publisher;
                return [namePublisher, author].join("");
            });
        },
        filteredPublishers() {
            if (!this.searchText) return this.publishers;
            return this.publishers.filter((_publisher, index) =>
                this.publisherStrings[index].includes(this.searchText)
            );
        },
        activePublisher() {
            if (this.activeIndex < 0) return null;
            return this.filteredPublishers[this.activeIndex];
        },
        filteredPublishersCount() {
            return this.filteredPublishers.length;
        },
    },
    methods: {
        async retrievePublishers() {
            try {
                this.publishers = await publisherService.getAll();
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
            this.retrievePublishers();
        },
        async removeAllPublishers() {
            if (confirm("Bạn muốn xóa tất cả Nhà xuất bản?")) {
                try {
                    await publisherService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        goToAddPublisher() {
            this.$router.push({ name: "publisher.add" });
        },
    },
    mounted() {
        this.refreshList();
    },
}
</script>
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