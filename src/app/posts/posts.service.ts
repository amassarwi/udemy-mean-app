import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postsData: any) => {
        return postsData.posts.map((post) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
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

  addPost(title: string, content: string) {
    const post = {
      id: null,
      title,
      content,
    };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        const postId = res.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, content, title, };
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe((res) => {
        console.log(res);
      })
  }

  getPost(id: string) {
    return {...this.posts.find(p => p.id === id)};
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
