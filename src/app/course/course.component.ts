import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { startWith, tap, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit {
  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get('courseId'), 10);

    // The bellow codes will emit both values at the same time, so they have to wait for each others
    // const course$ = this.coursesService.loadCourseById(courseId);
    // const lessons$ = this.coursesService.loadAllCourseLessons(courseId);
    // Combine latest will return a tuple
    // this.data$ = combineLatest([course$, lessons$]).pipe(
    //   map(([course, lessons]) => {
    //     return {
    //       course,
    //       lessons,
    //     };
    //   }),
    //   tap(console.log)
    // );

    // This codes will load the course first, then both the course and the lessons when the lessons are available
    const course$ = this.coursesService
      .loadCourseById(courseId)
      .pipe(startWith(null));
    const lessons$ = this.coursesService
      .loadAllCourseLessons(courseId)
      .pipe(startWith([]));

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => {
        return {
          course,
          lessons,
        };
      }),
      tap(console.log)
    );
  }
}
