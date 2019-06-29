import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postsCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(map((postsData: any) => {
        return {
          posts: postsData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            };
          }),
          postsCount: postsData.maxPosts,
        };
      }))
      .subscribe((mappedPostsData) => {
        this.posts = mappedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: mappedPostsData.postsCount
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const payload = new FormData();
    payload.append('title', title);
    payload.append('content', content);
    payload.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', payload)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content)
      postData.append('image', image, image.name);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }
    this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  deletePost(id: string) {
    return this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${id}`);
  }
}
