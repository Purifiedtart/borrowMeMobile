import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Listing } from '../../entities/Listing';
import { ListingProvider } from '../../providers/listing/listing';
import { NgForm } from '@angular/forms';
import { CustomerProvider } from '../../providers/customer/customer';
import { ItemPage } from '../item/item';

/**
 * Generated class for the CreateListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-create-listing',
	templateUrl: 'create-listing.html',
})
export class CreateListingPage {

	errorMessage: string;
	infoMessage: string;
	newListing: Listing;

	submitted: boolean;

	constructor(public navCtrl: NavController,
		public alertCtrl: AlertController,
		public navParams: NavParams,
		public listingProvider: ListingProvider,
		public customerProvider: CustomerProvider) {
		this.submitted = false;
		this.newListing = new Listing();
	}

	clear() {
		console.log("Clearing nows");
		this.infoMessage = null;
		this.errorMessage = null;
		this.submitted = false;
		this.newListing = new Listing();
		this.newListing.category = "";
		this.newListing.costPerDay = 0;
		this.newListing.listingDescription = "";
		this.newListing.listingTitle = "";
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CreateListingPage');
		this.customerProvider.getCustomer(sessionStorage.getItem("username")).subscribe(
			response => {
				this.newListing.customerEntity = response.customerEntity;
				console.log(this.newListing.customerEntity);
				console.log("***************Successfully set up customer*******************");
			},
			error => {
				this.errorMessage = "HTTP " + error.status + ": " + error.error.message;
			}
		)
	}

	create(createProductForm: NgForm) {
		this.submitted = true;
		if (this.newListing.costPerDay < 0) {
			let alert = this.alertCtrl.create({
				title: 'Invalid Listing information',
				subTitle: 'Cost/day cannot be less than 0',
				buttons: ['Dismiss']
			});
			this.newListing.costPerDay = 0;
			alert.present();
		}
		else {
			if (createProductForm.valid) {
				console.log(this.newListing);
				this.listingProvider.createListing(this.newListing).subscribe(
					response => {
						let alert = this.alertCtrl.create({
							title: 'Item listed Successfully',
							subTitle: 'Congratulations, a new listing has been made!',
							buttons: ['Dismiss']
						});
						console.log("Listing Id of new Item: " + response.listing.listingId);
						this.navCtrl.push(ItemPage, { 'listingToViewId': response.listing.listingId });
						alert.present();
						this.infoMessage = "New Listing " + response.listing.listingId + " created successfully";
					},
					error => {
						this.errorMessage = "HTTP " + error.status + ": " + error.error.message;
					}
				);
			}
			else {
				let alert = this.alertCtrl.create({
					title: 'Invalid Listing information',
					subTitle: 'Please ensure lisitng information is valid',
					buttons: ['Dismiss']
				});
				alert.present();
			}
		}
	}

}
