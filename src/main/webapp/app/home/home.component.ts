import { LoginService } from './../core/login/login.service';
import { AccountService } from './../core/auth/account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account } from './../core/user/account.model';
import { IEntry } from '../shared/model/entry.model';
import { Subscription } from 'rxjs';
import { ITEMS_PER_PAGE } from '../shared/constants/pagination.constants';
import { EntryService } from '../entities/entry/entry.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { JhiDataUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  entries: IEntry[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected entryService: EntryService,
    private accountService: AccountService,
    private loginService: LoginService,
    protected parseLinks: JhiParseLinks,
    protected eventManager: JhiEventManager,
    protected dataUtils: JhiDataUtils
  ) {
    this.entries = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.account = account));
    this.loadAll();
    this.registerChangeInEntries();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  loadAll(): void {
    this.entryService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IEntry[]>) => this.paginateEntries(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.entries = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginService.login();
    this.loadAll();
    this.registerChangeInEntries();
  }

  registerChangeInEntries(): void {
    this.eventSubscriber = this.eventManager.subscribe('entryListModification', () => this.reset());
  }

  trackId(index: number, item: IEntry): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateEntries(data: IEntry[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.entries.push(data[i]);
      }
    }
  }
}
