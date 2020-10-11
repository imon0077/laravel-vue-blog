<template>
    <div>
        <div class="content">
			<div class="container-fluid">
					
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					
					<p class="_title0">
						Blogs 
						<Button @click="$router.push('/create-blog')" v-if="isWritePermitted"><Icon type="md-add"/> Create Blog</Button>
					</p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Title</th>
								<th>Categories</th>
								<th>Tags</th>
								<th>Views</th>
								<th>created at</th>
								<th>Action</th>
							</tr>
								<!-- TABLE TITLE -->

								<!-- ITEMS -->
							<tr v-for="(row, i) in dataList" :key = "i" v-if="dataList.length">
								<td>{{row.id}}</td>
								<td class="_table_name">{{row.title}}</td>
								<td> 
									<span  v-for="(c, j) in row.cat" v-if="row.cat.length"><Tag type="border">{{c.categoryName}}</Tag></span> 
								</td>
								<td> 
									<span v-for="(t, j) in row.tag" v-if="row.tag.length"><Tag type="border">{{t.tagName}}</Tag></span> 
								</td>
								<td> {{row.views}}</td>

								<td>{{row.created_at}}</td>

                                <td>
									<Button type="info" size="small" >Visit blog</Button>
									<Button type="info" size="small" @click="$router.push(`/editblog/${row.id}`)" v-if="isUpdatePermitted">Edit</Button>
									<Button type="error" size="small" @click="showDeletingModal(row, i)"  :loading="row.isDeleting" v-if="isDeletePermitted">Delete</Button>
								</td>
							</tr>
								<!-- ITEMS -->

						</table>
					</div>
				</div>

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
			isAdding : false,
			dataList: [],
			index: -1,
			showDeleteModal: false,
			isDeleting: false,
			deleteItem: {},
			deletingIndex: -1
		}
	},

	methods : {
        showDeletingModal(row, i){
            console.log('the index is ',i)
            this.deletingIndex = i
			const deleteModalObj  =  {
				showDeleteModal: true,
				deleteUrl : 'app/delete_blog',
				data : {id: row.id},
				deletingIndex: i,
                isDeleted : false,
                msg : 'Are you sure you want to delete this blog?',
                successMsg: 'Blog has been deleted successfully!'
			}
			this.$store.commit('setDeletingModalObj', deleteModalObj)
			console.log('delete method called')

		}
	},

	async created(){
		const res = await this.callApi('get', 'app/blogsdata')
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
				this.dataList.splice(this.deletingIndex,1)
			}
		}
	}

}
</script>
