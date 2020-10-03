<template>
    <div>
        <div class="content">
			<div class="container-fluid">
					
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					
					<p class="_title0">
						Category 
						<Button @click="addModal=true"><Icon type="md-add"/> Add Category</Button>
					</p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Icon Image</th>
								<th>Category name</th>
								<th>Created at</th>
								<th>Action</th>
							</tr>
								<!-- TABLE TITLE -->

								<!-- ITEMS -->
							<tr v-for="(row, i) in dataList" :key = "i" v-if="dataList.length">
								<td>{{row.id}}</td>
								<td class="table_image">
									<img :src="row.iconImage" />
								</td>
								<td class="_table_name">{{row.categoryName}}</td>
								<td>{{row.created_at}}</td>
								<td>
									<Button type="info" size="small" @click="showEditModal(row, i)">Edit</Button>
									<Button type="error" size="small" @click="showdeletingModal(row, i)" :loading="row.isDeleting">Delete</Button>
								</td>
							</tr>
								<!-- ITEMS -->

						</table>
					</div>
				</div>

				<!-- adding modal -->
				<Modal
					v-model="addModal"
					title="Add Category"
					:mask-closable="false"	
					:closable="false"	
					>				
					
					<Input v-model="data.categoryName" placeholder="Enter category name"  />
					
                    <div class="space"></div>

                    <Upload
						ref="uploads"
                        type="drag"
                        :headers="{'x-csrf-token' : token, 'X-Requested-With' : 'XMLHttpRequest'}"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        action="/app/upload">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>
					<div class="demo-upload-list" v-if="data.iconImage">
						<img :src="`${data.iconImage}`" />
						<div class="demo-upload-list-cover">
							<Icon type="ios-trash-outline" @click="deleteImage"></Icon>
						</div>
					</div>

					<div slot="footer">
						<Button type="default" @click="addModal=false">Close</Button>
						<Button type="primary" @click="dataSubmit" :disabled="isAdding" :loading="isAdding">{{isAdding ? 'adding..' : 'Add Category' }}</Button>
					</div>
				</Modal>

				<!-- editing modal -->
				<Modal
					v-model="editModal"
					title="Edit Category"
					:mask-closable="false"	
					:closable="false"	
					>				
					
					<Input v-model="editData.categoryName" placeholder="Edit category name"  />
					
                    <div class="space"></div>

                    <Upload v-show="isIconImageNew"
						ref="editDataUploads"
                        type="drag"
                        :headers="{'x-csrf-token' : token, 'X-Requested-With' : 'XMLHttpRequest'}"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        action="/app/upload">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>
					<div class="demo-upload-list" v-if="editData.iconImage">
						<img :src="`${editData.iconImage}`" />
						<div class="demo-upload-list-cover">
							<Icon type="ios-trash-outline" @click="deleteImage(false)"></Icon>
						</div>
					</div>
					
					<div slot="footer">
						<Button type="default" @click="closeEditModal">Close</Button>
						<Button type="primary" @click="dataUpdate" :disabled="isAdding" :loading="isAdding">{{isAdding ? 'updating..' : 'Edit Category' }}</Button>
					</div>
				</Modal>

				<!-- Delete Modal -->
				<deleteModal></deleteModal>

			</div>
		</div>
    </div>
</template>

<script>
import deleteModal from '../components/deleteModal'
import {mapGetters} from 'vuex'
export default { 	 	 		 											 

	data(){
		return{
			data: {
				iconImage: "",
        		categoryName: ""
			}, 
			addModal : false,
			editModal: false,
			isAdding : false,
			dataList: [],
			editData: {
				iconImage: "",
        		categoryName: ""
			},
			index: -1,
			showDeleteModal: false,
			isDeleting: false,
			deleteItem: {},
            deletingIndex: -1,
            token: '',
			isIconImageNew: false,
			isEditingItem: false
		}
	},

	methods: {
		async dataSubmit(){
			 if(this.data.categoryName.trim()== '') return this.e('Category name is requied')
			 if(this.data.iconImage.trim()== '') return this.e('Icon Image is requied')
			 this.data.iconImage = `${this.data.iconImage}`;
			 const res = await this.callApi('post', 'app/create_category', this.data)
			 if(res.status === 201){
				 this.dataList.unshift(res.data)
				 this.s()
				 this.addModal = false
				 this.data.categoryName = ''
				 this.data.iconImage = ''
			 }
			 else{
				 if(res.status === 422){
					 if(res.data.errors.categoryName){
						 this.e(res.data.errors.categoryName[0])
					 }
					 if (res.data.errors.iconImage) {
						this.e(res.data.errors.iconImage[0]);
					}
				 }
				 else{
					this.swr()
				 }
				
			 }
		},

		async dataUpdate(){
			 if(this.editData.categoryName.trim()== '') return this.e('Category name is requied')
			 if(this.editData.iconImage.trim()== '') return this.e('Icon Image is requied')
			 const res = await this.callApi('post', 'app/edit_category', this.editData)
			 if(res.status === 200){
				 this.dataList[this.index].categoryName = this.editData.categoryName
				 this.s('Data has been updated successfully.')
				 this.editModal = false
			 }
			 else{
				 if(res.status === 422){
					 if(res.data.errors.categoryName){
						 this.e(res.data.errors.categoryName[0])
					 }
					 if (res.data.errors.iconImage) {
						this.e(res.data.errors.iconImage[0]);
					}
				 }
				 else{
					this.swr()
				 }
				
			 }
		},

		showEditModal(row, index){
			//  let obj = {
			// 	 id : row.id,
			// 	 tagName : row.tagName
			//  }
			 this.editData = row
			 this.editModal = true
			 this.index = index
			 this.isEditingItem = true
		},

		showdeletingModal(row, index){
			const deleteModalObj  = {
				showDeleteModal : true,
				deleteUrl :  'app/delete_category',
				data : row,
				deletingIndex: index,
				isDeleted : false
			}
			this.$store.commit('setDeletingModalObj', deleteModalObj)
		},

		handleSuccess (res, file) {
			res = `/uploads/${res}`
			if(this.isEditingItem){
				return this.editData.iconImage = res
			}
			this.data.iconImage = res
		},
		handleError(res, file) {
			this.$Notice.warning({
				title: "The file format is incorrect",
				desc: `${
				file.errors.file.length
					? file.errors.file[0]
					: "Something went wrong!"
				}`
			});
		},
		handleFormatError (file) {
			this.$Notice.warning({
				title: 'The file format is incorrect',
				desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
			});
		},
		handleMaxSize (file) {
			this.$Notice.warning({
				title: 'Exceeding file size limit',
				desc: 'File  ' + file.name + ' is too large, no more than 2M.'
			});
		},

		async deleteImage(isAdd=false){
			let image
			if(!isAdd){ // for editting
				this.isIconImageNew = true
				image = this.editData.iconImage
				this.editData.iconImage = ''
				this.$refs.editDataUploads.clearFiles()
			}
			else{
				image = this.data.iconImage
				this.data.iconImage = ''
				this.$refs.uploads.clearFiles()
			}
			
			const res = await this.callApi('post', 'app/delete_image', {imageName: image})
			if(res.status != 200){
				this.data.iconImage = image
				this.swr()
			}
		},
		closeEditModal(){
			this.isEditingItem = false
			this.editModal = false
		}
	},

	async created(){
        this.token = window.Laravel.csrfToken
		const res = await this.callApi('get', 'app/get_category')
		if(res.status === 200){
			this.dataList = res.data
		}
		else{
			this.swr()
		}
	},

	components : {
		deleteModal
	},
	computed : {
		...mapGetters(['getDeleteModalObj'])
	},
	watch : {
		getDeleteModalObj(obj){
			if(obj.isDeleted){
				this.dataList.splice(obj.deletingIndex, 1)
			}
		}
	}

}
</script>
