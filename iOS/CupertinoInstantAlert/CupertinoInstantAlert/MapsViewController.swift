//
//  MapsViewController.swift
//  CupertinoInstantAlert
//
//  Created by Gautam Ajjarapu on 4/7/17.
//  Copyright © 2017 Gautam Ajjarapu. All rights reserved.
//

import UIKit
import Firebase
import GoogleMaps
import SwiftyJSON
import Alamofire
struct mapItem
{
    var lat: Double!
    var lon: Double!
    var notif: String
    var address: String
    
    // Initialize from arbitrary data
    init(lat: Double, lon: Double, notif: String, address: String) {
        self.lat = lat
        self.lon = lon
        self.notif = notif
        self.address = address
    }
    
    
}

var coords = [mapItem]()
let camera = GMSCameraPosition.camera(withLatitude: 37.3230, longitude: -122.0322, zoom: 12.0)
let mapView = GMSMapView.map(withFrame: CGRect.zero, camera: camera)

class MapsViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //GMSPlacesClient.provideAPIKey("AIzaSyD5m07TQPJqftIfgTcUJpZpGiMxgPKKG9g")
        // Do any additional setup after loading the view.
        //mapView.clear()
        let currentmarker = GMSMarker()
        currentmarker.position = CLLocationCoordinate2D(latitude: 37.3258, longitude: -122.0424)
        currentmarker.title = "Current Location"
        currentmarker.snippet = "Quinlan Community Center"
        currentmarker.icon = GMSMarker.markerImage(with: .black)
        currentmarker.map = mapView
        self.view = mapView
        
        
        rootRef.observe(.childAdded, with: {
            snapshot in
            let object = JSON(snapshot.value!)
            //mapView.clear()
            if(object["type"].string! == "message") {
            //print(subJson)
            var latitude = 0.0
            var longitude = 0.0
            var message = ""
            var add = ""
            
            if object["latitude"] != JSON.null {
                latitude = object["latitude"].double!
            }
            if object["longitude"] != JSON.null {
                longitude = object["longitude"].double!
            }
            
            if object["message"] != JSON.null {
                message = object["message"].string!
            }
            
                if object["location"] != JSON.null {
                    add = object["location"].string!
                }
                
                if latitude != 0.0 {
                
                var currentLoc = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=37.3258,-122.0424&destinations=\(latitude),\(longitude)&key=AIzaSyBAe1D2F75M4aKbFI8Vu61no_SLBhm8yaA";
                
                
                Alamofire.request(currentLoc).responseJSON { response in
                   // print(response.request)  // original URL request
                    //print(response.response) // HTTP URL response
                    print(response)     // server data
                    //print(response.result)   // result of response serialization
                    var miles = JSON(response.value!)["rows"][0]["elements"][0]["distance"]["text"].string!
                    //print(miles)
                    
                    let index1 = miles.index(miles.endIndex, offsetBy: -2)
                    print(miles.substring(from: index1))
                    if(miles.substring(from: index1) == "ft")
                    {
                        print("here")
                        let alert = UIAlertController(title: "Alert", message: "Nearby: \(message)", preferredStyle: UIAlertControllerStyle.alert)
                        alert.addAction(UIAlertAction(title: "Close", style: UIAlertActionStyle.default, handler: nil))
                        self.present(alert, animated: true, completion: nil)
                    }
                    else {
                    let index = miles.index(miles.startIndex, offsetBy: 3)
                    print(miles.substring(to: index))
                    
                    
                    
                    if Double(miles.substring(to: index))! < 1.0 {
                        
                        let alert = UIAlertController(title: "Alert", message: "Nearby: \(message)", preferredStyle: UIAlertControllerStyle.alert)
                            alert.addAction(UIAlertAction(title: "Close", style: UIAlertActionStyle.default, handler: nil))
                            self.present(alert, animated: true, completion: nil)
                         //print("here")
                    }
                    }
                    }
                }
            
            
            let myItem = mapItem(lat: latitude, lon: longitude, notif: message, address: add)
            coords.insert(myItem, at: 0)
            //print(coords)
            self.updateMarkers()
            
            }
           
        })
        
        rootRef.observe(.childRemoved, with: {
            snapshot in
            let object = JSON(snapshot.value!)
            mapView.clear()
            if object["type"] == "message" {
                var place = 0;
                for i in 0...list.count-1{
                    if(list[i].info == object["message"].string && list[i].loc == object["location"].string && list[i].time == object["timestamp"].string)
                    {
                        place = i
                    }
                }
                
                coords.remove(at: place)
                self.updateMarkers()
            }
            
        })
        // Creates a marker in the center of the map.
   
    }
    

 

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func updateMarkers()
    {
        //print(coords.count)
        for i in 0...coords.count-1{
            let marker = GMSMarker()
            //print(coords[i])
            marker.position = CLLocationCoordinate2D(latitude: coords[i].lat, longitude: coords[i].lon)
            marker.title = coords[i].address
            marker.snippet = coords[i].notif
            marker.map = mapView
            
        }
        //print(coords)
        
    }
 
    
    
    

}






