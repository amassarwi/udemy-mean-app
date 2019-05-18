import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {

    public post: Post;
    public isLoading = false;
    private mode = 'create';
    private id: string;

    constructor(
        private postsService: PostsService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('id')) {
                this.mode = 'edit';
                this.id = paramMap.get('id');
                this.isLoading = true;
                this.postsService.getPost(this.id)
                    .subscribe((postData) => {
                        this.isLoading = false;
                        this.post = {id: postData._id, title: postData.title, content: postData.content};
                    })
            } else {
                this.mode = 'create';
                this.id = null;
            }
        });
    }

    savePost(postForm: NgForm) {
        if (postForm.invalid) {
            return;
        }
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postsService.addPost(postForm.value.title, postForm.value.content);
        } else {
            this.postsService.updatePost(this.id, postForm.value.title, postForm.value.content);
        }
        postForm.resetForm();
    }
}
