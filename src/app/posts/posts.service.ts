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
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any}>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(map((postsData: any) => {
        return postsData.posts.map((post) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          };
        });
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
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
        const post: Post = {
          id: res.post.id,
          title,
          content,
          imagePath: res.post.imagePath,
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: '',
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  deletePost(id: string) {
    this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${id}`)
      .subscribe((res) => {
        const newPosts = this.posts.filter((post: Post) => post.id !== id);
        this.posts = newPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
