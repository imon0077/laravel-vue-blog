<template>
    <div>
        <div class="content">
			<div class="container-fluid">
					
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					
					<p class="_title0">
						Assign Role Permission 
						<Select v-model="data.id"  placeholder="Select Role" style="width:300px" @on-change="getPermissionData">
                            <Option :value="row.id" v-for="(row, i) in roles" :key="i" v-if="roles.length">{{row.roleName}}</Option>
                        </Select>
					</p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>Resource Name</th>
								<th>Read</th>
								<th>Write</th>
								<th>Update</th>
								<th>Delete</th>
							</tr>
								<!-- TABLE TITLE -->

								<!-- ITEMS -->
							<tr v-for="(row, i) in dataList" :key="i">
								<td>{{row.resourceName}}</td>
								<td><Checkbox v-model="row.read"></Checkbox></td>
								<td><Checkbox v-model="row.write"></Checkbox></td>
								<td><Checkbox v-model="row.update"></Checkbox></td>
								<td><Checkbox v-model="row.delete"></Checkbox></td>
							</tr>
								<!-- ITEMS -->
							<div class="center_button">
								<Button type="primary" :loading="isAdding" :disabled="isAdding" @click="dataSubmit">{{isAdding ? 'Assigning..' : 'Assign' }}</Button>
							</div>
						</table>
					</div>
				</div>

			</div>
		</div>
    </div>
</template>

<script>
export default {

	data(){
		return{
			data: {
				id : null
			}, 
			isAdding : false,
            roles: [],
			dataList: [
				{resourceName: 'Home', read: true, write: false, update: false, delete: false, name: '/'},
				{resourceName: 'Tags', read: false, write: false, update: false, delete: false, name: 'tags'},
				{resourceName: 'Category', read: false, write: false, update: false, delete: false, name: 'category'},
				{resourceName: 'Admin Users', read: false, write: false, update: false, delete: false, name: 'admin-users'},
				{resourceName: 'Create Blog', read: false, write: false, update: false, delete: false, name: 'create-blog'},
				{resourceName: 'Blogs', read: false, write: false, update: false, delete: false, name: 'blogs'},

				{resourceName: 'Role', read: false, write: false, update: false, delete: false, name: 'role'},
				{resourceName: 'Assign Role', read: false, write: false, update: false, delete: false, name: 'assign-role'},
			],

			defaultPermission: [				
				{resourceName: 'Home', read: true, write: false, update: false, delete: false, name: '/'},
				{resourceName: 'Tags', read: false, write: false, update: false, delete: false, name: 'tags'},
				{resourceName: 'Category', read: false, write: false, update: false, delete: false, name: 'category'},
				{resourceName: 'Admin Users', read: false, write: false, update: false, delete: false, name: 'admin-users'},
				{resourceName: 'Create Blog', read: false, write: false, update: false, delete: false, name: 'create-blog'},
				{resourceName: 'Blogs', read: false, write: false, update: false, delete: false, name: 'blogs'},

				{resourceName: 'Role', read: false, write: false, update: false, delete: false, name: 'role'},
				{resourceName: 'Assign Role', read: false, write: false, update: false, delete: false, name: 'assign-role'},
			],
		}
	},

	methods: {
		async dataSubmit(){
			this.isAdding = true
			let data = JSON.stringify(this.dataList)
			const res = await this.callApi('post', 'app/assign-role', {'permission' : data, id : this.data.id})
			if(res.status === 200){
				this.s('Role has been assign successfully')
				let index = this.roles.findIndex(role => role.id == this.data.id)
				this.roles[index].permission = data
			}
			this.isAdding = false
		},

		getPermissionData(){
			let index = this.roles.findIndex(role => role.id == this.data.id)
			let permission = this.roles[index].permission
			if(!permission){
				this.dataList = this.defaultPermission
			}
			else{
				this.dataList = JSON.parse(permission)
			}
		}
	},

	async created(){
		const res = await this.callApi('get', 'app/get_roles')
		if(res.status === 200){
			this.roles = res.data
			if(res.data.length){
				this.data.id = res.data[0].id
				if(res.data[0].permission){
					this.dataList = JSON.parse(res.data[0].permission)
					//this.dataList = this.defaultPermission
				}
			}
			else{
				this.swr()
			}
		}
		else{
			this.swr()
		}
	},
	
}
</script>
