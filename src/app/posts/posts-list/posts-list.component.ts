import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private subscription: Subscription;

  constructor(
    private postsService: PostsService,
  ) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.subscription = this.postsService.getPostUpdateListener()
      .subscribe(
        (posts: Post[]) => this.posts = posts,
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deletePost(id: string) {
    this.postsService.deletePost(id);
  }
}
