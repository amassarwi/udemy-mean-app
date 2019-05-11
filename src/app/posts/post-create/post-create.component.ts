import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['post-create.component.scss'],
})
export class PostCreateComponent {

    enteredTitle = '';
    enteredContent = '';
    @Output()
    postCreated = new EventEmitter();

    addPost() {
        const post = {
            title : this.enteredTitle,
            content: this.enteredContent,
        };
        this.postCreated.emit(post);
    }
}
