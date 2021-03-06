import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular';
import { Listing } from '../../entities/Listing';
import { ListingProvider} from '../../providers/listing/listing';
import { FormControl } from '@angular/forms';
import { ItemPage } from "../item/item";
import 'rxjs/add/operator/debounceTime';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

	errorMessage: string;
	listings: Listing[];
	searchItems: any;
	searchTerm: string = '';
	searchControl: FormControl;

  constructor(public navCtrl: NavController, public navParams: NavParams, public listingProvider: ListingProvider) {
    this.searchControl = new FormControl();
	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
	
	this.listingProvider.getListings().subscribe(
		response => {
			this.listings = response.listings;
		},
		error => {
			this.errorMessage = "HTTP" + error.status + ": " + error.error.message;
		}
	);
	
	this.searchControl.valueChanges.debounceTime(300).subscribe(search => {

		this.setFilteredItems();

	});

  }
  
    ionViewWillEnter() {
		this.listingProvider.getListings().subscribe(
			response => {
				this.listings = response.listings;
			},
			error => {
				this.errorMessage = "HTTP" + error.status + ": " + error.error.message;
			}
		);

	}
	
	viewItem(listingId) {
	this.navCtrl.push(ItemPage, {'listingToViewId': listingId});	
	}
	
	
	filterItems(searchTerm) {
		return this.listings.filter((listing) => {
            return listing.listingTitle.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });    
	}
  
  setFilteredItems() {
	 this.searchItems = this.filterItems(this.searchTerm);
  }

}
