<template>
    <div>
        <div class="content">
			<div class="container-fluid">
					
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					
					<p class="_title0">
						Admin users 
						<Button @click="addModal=true"><Icon type="md-add"/> Add Admin</Button>
					</p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Email</th>
								<th>User type</th>
								<th>Created at</th>
								<th>Action</th>
							</tr>
								<!-- TABLE TITLE -->

								<!-- ITEMS -->
							<tr v-for="(row, i) in dataList" :key = "i" v-if="dataList.length">
								<td>{{row.id}}</td>
								<td class="_table_name">{{row.fullName}}</td>
								<td class="">{{row.email}}</td>
								<td class="">{{row.userType}}</td>
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
					title="Add Admin"
					:mask-closable="false"	
					:closable="false"	
					>	

                    <div class="space">
                        <Input type="text" v-model="data.fullName" placeholder="Enter full name"  />
                    </div>	

                    <div class="space">
                        <Input type="email" v-model="data.email" placeholder="Enter email"  />
                    </div>

                    <div class="space">
                        <Input type="password" v-model="data.password" placeholder="Enter password"  />
                    </div>			

                    <div class="space">
                        <Select v-model="data.role_id"  placeholder="Select admin type">
                            <Option :value="row.id" v-for="(row, i) in roles" :key="i" v-if="roles.length">{{row.roleName}}</Option>
                        </Select>
                    </div>			
					
					<div slot="footer">
						<Button type="default" @click="addModal=false">Close</Button>
						<Button type="primary" @click="dataSubmit" :disabled="isAdding" :loading="isAdding">{{isAdding ? 'adding..' : 'Submit' }}</Button>
					</div>
				</Modal>

				<!-- editing modal -->
				<Modal
					v-model="editModal"
					title="Edit Admin"
					:mask-closable="false"	
					:closable="false"	
					>				
					
                    <div class="space">
                        <Input type="text" v-model="editData.fullName" placeholder="Full name"  />
                    </div>
                    <div class="space">
                        <Input type="email" v-model="editData.email" placeholder="Email"  />
                    </div>
                    <div class="space">
                        <Input type="password" v-model="editData.password" placeholder="Password"  />
                    </div>
                    <div class="space">
                        <Select v-model="editData.role_id"  placeholder="Select admin type">
                            <Option :value="row.id" v-for="(row, i) in roles" :key="i" v-if="roles.length">{{row.roleName}}</Option>
                        </Select>
                    </div>
					
					<div slot="footer">
						<Button type="default" @click="editModal=false">Close</Button>
						<Button type="primary" @click="dataUpdate" :disabled="isAdding" :loading="isAdding">{{isAdding ? 'updating..' : 'Update' }}</Button>
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
				fullName: '',
				email: '',
				password: '',
				role_id : null
			}, 
			addModal : false,
			editModal: false,
			isAdding : false,
			dataList: [],
			editData: {
				fullName: '',
				email: '',
				password: '',
			},
			index: -1,
			showDeleteModal: false,
			isDeleting: false,
			deleteItem: {},
			deletingIndex: -1,
			roles : [],
		}
	},

	methods: {
		async dataSubmit(){
			if(this.data.fullName.trim()=='') return this.e('Full name is required')
            if(this.data.email.trim()=='') return this.e('Email is required')
            if(this.data.password.trim()=='') return this.e('Password is required')
             if(!this.data.role_id) return this.e('User role is required')
            
			 const res = await this.callApi('post', 'app/create_user', this.data)
			 if(res.status === 201){
				 this.dataList.unshift(res.data)
				 this.s()
				 this.addModal = false
				 this.data.tagName = ''
			 }
			 else{
				 if(res.status === 422){
					for(let i in res.data.errors){
                        this.e(res.data.errors[i][0])
                    }
				 }
				 else{
					this.swr()
				 }
				
			 }
		},

		async dataUpdate(){
			 if(this.editData.fullName.trim()=='') return this.e('Full name is required')
             if(this.editData.email.trim()=='') return this.e('Email is required')
             if(!this.editData.role_id) return this.e('User role is required')

			 const res = await this.callApi('post', 'app/edit_user', this.editData)
			 if(res.status === 200){
				 this.dataList[this.index] = this.editData
				 this.s('Data has been edited successfully.')
				 this.editModal = false
			 }
			 else{
				 if(res.status === 422){
					for(let i in res.editData.errors){
                        this.e(res.editData.errors[i][0])
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
				fullName : row.fullName, 
				email : row.email, 
				userType : row.userType, 
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

		const [res, resRole] = await Promise.all([
			this.callApi('get', 'app/get_users'),
			this.callApi('get', 'app/get_roles')
		])

		if(res.status === 200){
			this.dataList = res.data
		}
		else{
			this.swr()
		}

		if(resRole.status === 200){
			this.roles =resRole.data
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
