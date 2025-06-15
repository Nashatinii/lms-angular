import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-course',
  templateUrl: './video-course.component.html',
  styleUrls: ['./video-course.component.css']
})
export class VideoCourseComponent {
  video: SafeResourceUrl = '';
  courseName: string = '';
  title: string = '';

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    let videoUrl = this.route.snapshot.paramMap.get('video') || '';
    this.courseName = this.route.snapshot.paramMap.get('course') || '';
    this.title = this.route.snapshot.paramMap.get('materialTitle') || '';

    // Check if the URL is a normal YouTube URL
    if (videoUrl.includes('youtube.com/watch')) {
      // Extract video ID from the URL (this assumes URL is of the form youtube.com/watch?v=VIDEO_ID)
      const videoId = new URL(videoUrl).searchParams.get('v');
      videoUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // Sanitize the video URL
    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
}
