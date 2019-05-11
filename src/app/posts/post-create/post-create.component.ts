import { Component, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['post-create.component.scss'],
})
export class PostCreateComponent {

    @Output()
    postCreated = new EventEmitter<Post>();

    addPost(postForm: NgForm) {
        if (postForm.invalid) {
            return;
        }
        const post: Post = {
            title : postForm.value.title,
            content: postForm.value.content,
        };
        this.postCreated.emit(post);
    }
}
