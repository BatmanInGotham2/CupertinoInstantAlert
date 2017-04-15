//
//  InfoTableViewController.swift
//  CupertinoInstantAlert
//
//  Created by Gautam Ajjarapu on 4/7/17.
//  Copyright © 2017 Gautam Ajjarapu. All rights reserved.
//

import UIKit
import Firebase
import SwiftyJSON

struct infoItem
{
    var info: String!
    var loc: String!
    var tag: String!
    var time: String!
    //let ref: Firebase?
    
    
    // Initialize from arbitrary data
    init(info: String, loc: String, tag: String, time: String) {
        self.info = info
        self.loc = loc
        self.tag = tag
        self.time = time
        //self.ref = nil
    }
    
    
}
var list = [infoItem]()


class InfoTableViewController: UITableViewController {

    //var refreshControl = UIRefreshControl()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        list.removeAll();
        tableView.rowHeight = 150
        //tableView.rowHeight = UITableViewAutomaticDimension
       
        rootRef.observe(.childAdded, with: {
            snapshot in
            let object = JSON(snapshot.value!)
            if object["type"] == "message" {
                            //print(subJson)
                var timestamp = ""
                var address = ""
                var tags = ""
                var message = ""
                if object["timestamp"] != JSON.null {
                    var temp = object["timestamp"].string!
                    var ind = temp.index(temp.startIndex, offsetBy: 21)
                    timestamp = temp.substring(to: ind)
                }
                if object["location"] != JSON.null {
                    address = object["location"].string!
                }
                if object["message"] != JSON.null {
                    message = object["message"].string!
                }
                if object["tag"] != JSON.null {
                    tags = object["tag"].string!
                }
                
                
                let myItem = infoItem(info: message, loc: address, tag: tags, time: timestamp)
                list.insert(myItem, at: 0)
                self.tableView.reloadData()
        }

        })
        rootRef.observe(.childRemoved, with: {
            snapshot in
            let object = JSON(snapshot.value!)
            if object["type"] == "message" {
            var place = 0;
            for i in 0...list.count-1{
                if(list[i].info == object["message"].string && list[i].loc == object["location"].string && list[i].time == object["timestamp"].string)
                {
                    place = i
                }
            }
            
            list.remove(at: place)
            self.tableView.reloadData()
            }
            
        })
        
    }


    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

   /* override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 0
    }*/

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return list.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        //let cell = tableView.dequeueReusableCell(withIdentifier: "infoCell") as! InfoTableViewCell!
        let cell = tableView.dequeueReusableCell(withIdentifier: "infoCell", for: indexPath) as! InfoTableViewCell

        if(list.count > 0)
        {
            let data = list[indexPath.row] as infoItem!
            cell.time.text = data!.time!
            cell.location.text = data!.loc!
            cell.message.text = data!.info!
            cell.time.sizeToFit()
            cell.location.sizeToFit()
            cell.message.sizeToFit()
         
            if(data?.tag == "tagname")
            {
                //changecolor
            }
            
            
            
        }

        return cell
    }
    

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
