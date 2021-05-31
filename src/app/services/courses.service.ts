import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<{ payload: Course[] }>('/api/courses').pipe(
      map((res) => res.payload),
      shareReplay()
    );
  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
    return this.http
      .get<{ payload: Lesson[] }>('/api/lessons', {
        params: {
          pageSize: Infinity,
          courseId: courseId.toString(),
        },
      })
      .pipe(
        map((res) => res.payload),
        shareReplay()
      );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLesson(search: string): Observable<Lesson[]> {
    return this.http
      .get<{ payload: Lesson[] }>('/api/lessons', {
        params: {
          filter: search,
          pageSize: '100',
        },
      })
      .pipe(
        map((res) => res.payload),
        shareReplay()
      );
  }

  loadCourseById(courseId: number) {
    return this.http
      .get<Course>(`/api/courses/${courseId}`)
      .pipe(shareReplay());
  }
}
