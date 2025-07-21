import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import 'codemirror/mode/javascript/javascript.js';
import { HttpClient }  from '@angular/common/http';
@Component({
  selector: 'app-code-mirror-editor',
  standalone: true,
  imports: [FormsModule, CodemirrorModule],
  template: `<ngx-codemirror
      [(ngModel)]="code"
      [options]="editorOptions"
      style="height:400px; width: 50px; border:1px solid #ccc">
    </ngx-codemirror>
    <button (click)="submitCode()">Submit Code</button>
  `
})
export class CodeEditorComponent {
  code: string = "";
  editorOptions = {
    theme: 'material',
    mode: 'javascript',
    lineNumbers: true
  };
  constructor(private http: HttpClient) {}

  submitCode(): void {
    console.log('Submitting code:', this.code);
    this.http
      .post('/api/code/analyze', { code: this.code })
      .subscribe({
        next: (res:any) => console.log('Server response:', res),
        error: (err:any) => console.error('Submission failed', err)
      });
  }
}
