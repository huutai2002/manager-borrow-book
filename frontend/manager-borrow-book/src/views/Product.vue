<template>
    <h1>Trang chi tiết sách</h1>

    <div class="row page">
        <div class="col-md-5">
            <img src="https://thuvienkontum.vn/images/khoanh/thum_16328760570.jpg" alt="">
        </div>
        <div class="col-md-5 offset-md-2 book-detail">
            <h3 class="name">Name</h3>
            <h4 class="author">Author</h4>
            <div class="pushlisher">pushlisher</div>
            <h4 class="price">price</h4>
            <div class="year-push">2009</div>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Mượn sách
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Xác nhận</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i
                                    class="fa-x"></i></button>
                        </div>
                        <div class="modal-body">
                            Bạn chắc chắn muốn mượn quyển sách này?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-primary">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
img {
    width: 100%;
}

.book-detail {
    font-family: Arial, Helvetica, sans-serif;
}

.page {
    max-width: 800px;
}
</style>