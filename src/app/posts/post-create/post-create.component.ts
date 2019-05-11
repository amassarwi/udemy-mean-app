import { Component, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['post-create.component.scss'],
})
export class PostCreateComponent {

    enteredTitle = '';
    enteredContent = '';
    @Output()
    postCreated = new EventEmitter<Post>();

    addPost() {
        const post: Post = {
            title : this.enteredTitle,
            content: this.enteredContent,
        };
        this.postCreated.emit(post);
    }
}
