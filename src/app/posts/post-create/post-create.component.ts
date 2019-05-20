import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: 'post-create.component.html',
    styleUrls: ['post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {

    public post: Post;
    public isLoading = false;
    public form: FormGroup;
    public imagePreview: string;
    private mode = 'create';
    private id: string;

    constructor(
        private postsService: PostsService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(3),
                ],
            }),
            content: new FormControl(null, {
                validators: [
                    Validators.required,
                ]
            }),
            image: new FormControl(null, {
                validators: [
                    Validators.required,
                ],
                asyncValidators: [
                    mimeType,
                ]
            }),
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('id')) {
                this.mode = 'edit';
                this.id = paramMap.get('id');
                this.isLoading = true;
                this.postsService.getPost(this.id)
                    .subscribe((postData) => {
                        this.isLoading = false;
                        this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: null};
                        this.form.setValue({title: this.post.title, content: this.post.content});
                    })
            } else {
                this.mode = 'create';
                this.id = null;
            }
        });
    }

    imagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            image: file,
        });
        this.form.controls.image.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    savePost() {
        if (this.form.invalid) {
            return;
        }
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            this.postsService.updatePost(this.id, this.form.value.title, this.form.value.content);
        }
        this.form.reset();
    }
}
