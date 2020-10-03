<template>
    <div>
        <div class="content">
			<div class="container-fluid">
					
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					
					<p class="_title0">
						Tags 
						<Button @click="addModal=true"><Icon type="md-add"/> Add tag</Button>
					</p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Tag name</th>
								<th>Created at</th>
								<th>Action</th>
							</tr>
								<!-- TABLE TITLE -->

								<!-- ITEMS -->
							<tr v-for="(row, i) in dataList" :key = "i" v-if="dataList.length">
								<td>{{row.id}}</td>
								<td class="_table_name">{{row.tagName}}</td>
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

				<!--  adding modal -->
				<Modal
					v-model="addModal"
					title="Add Tag"
					:mask-closable="false"	
					:closable="false"	
					>				
					<Input v-model="data.tagName" placeholder="Enter tag name"  />
					
					<div slot="footer">
						<Button type="default" @click="addModal=false">Close</Button>
						<Button type="primary" @click="dataSubmit" :disabled="isAdding" :loading="isAdding">{{isAdding ? 'adding..' : 'Add Tag' }}</Button>
					</div>
				</Modal>

				<!-- editing modal -->
				<Modal
					v-model="editModal"
					title="Edit Tag"
					:mask-closable="false"	
					:closable="false"	
					>				
					<Input v-model="editData.tagName" placeholder="Edit tag name"  />
					
					<div slot="footer">
						<Button type="default" @click="editModal=false">Close</Button>
						<Button type="primary" @click="dataUpdate" :disabled="isAdding" :loading="isAdding">{{isAdding ? 'updating..' : 'Edit Tag' }}</Button>
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
				tagName: ''
			}, 
			addModal : false,
			editModal: false,
			isAdding : false,
			dataList: [],
			editData: {
				tagName: ''
			},
			index: -1,
			showDeleteModal: false,
			isDeleting: false,
			deleteItem: {},
			deletingIndex: -1
		}
	},

	methods: {
		async dataSubmit(){
			 if(this.data.tagName.trim()== '') return this.e('Tag name is requied')
			 const res = await this.callApi('post', 'app/create_tag', this.data)
			 if(res.status === 201){
				 this.dataList.unshift(res.data)
				 this.s()
				 this.addModal = false
				 this.data.tagName = ''
			 }
			 else{
				 if(res.status === 422){
					 if(res.data.errors.tagName){
						 this.e(res.data.errors.tagName[0])
					 }
				 }
				 else{
					this.swr()
				 }
				
			 }
		},

		async dataUpdate(){
			 if(this.editData.tagName.trim()== '') return this.e('Tag name is requied')
			 const res = await this.callApi('post', 'app/edit_tag', this.editData)
			 if(res.status === 200){
				 this.dataList[this.index].tagName = this.editData.tagName
				 this.s('Data has been edited successfully.')
				 this.editModal = false
			 }
			 else{
				 if(res.status === 422){
					 if(res.data.errors.tagName){
						 this.e(res.data.errors.tagName[0])
					 }
				 }
				 else{
					this.swr()
				 }
				
			 }
		},

		showEditModal(row, index){
			 let obj = {
				 id : row.id,
				 tagName : row.tagName
			 }
			 this.editData = obj
			 this.editModal = true
			 this.index = index
		},

		showdeletingModal(row, index){
			const deleteModalObj  = {
				showDeleteModal : true,
				deleteUrl :  'app/delete_tag',
				data : row,
				deletingIndex: index,
				isDeleted : false
			}
			this.$store.commit('setDeletingModalObj', deleteModalObj)
		}
	},

	async created(){
		const res = await this.callApi('get', 'app/get_tags')
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
