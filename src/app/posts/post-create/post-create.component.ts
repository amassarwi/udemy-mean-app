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
                this.post = this.postsService.getPost(this.id);
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
        if (this.mode === 'create') {
            this.postsService.addPost(postForm.value.title, postForm.value.content);
        } else {
            this.postsService.updatePost(this.id, postForm.value.title, postForm.value.content);
        }
        postForm.resetForm();
    }
}
