import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  private subscription: Subscription;

  constructor(
    private postsService: PostsService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.subscription = this.postsService.getPostUpdateListener()
      .subscribe(
        (posts: Post[]) =>{
          this.posts = posts;
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deletePost(id: string) {
    this.postsService.deletePost(id);
  }

  onChangePage(pageData: PageEvent) {
    console.log(pageData);
  }
}
