//
//  QuestionsTableViewController.swift
//  CupertinoInstantAlert
//
//  Created by Gautam Ajjarapu on 4/8/17.
//  Copyright © 2017 Gautam Ajjarapu. All rights reserved.
//

import UIKit
import Firebase
import SwiftyJSON


struct questionItem
{
    var q: String!
    var a: String!

    var atTime: String!
    //let ref: Firebase?
    
    
    // Initialize from arbitrary data
    init(q: String, a: String, atTime: String) {
        self.q = q
        self.a = a
        self.atTime = atTime
        //self.ref = nil
    }
    
    
}
var qList = [questionItem]()


class QuestionsTableViewController: UITableViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        qList.removeAll();
        tableView.rowHeight = 150
        //tableView.rowHeight = UITableViewAutomaticDimension

        rootRef.observe(.childAdded, with: {
            snapshot in
            let object = JSON(snapshot.value!)
            if object["type"] == "question" {
                //print(object)
                var timestamp = ""
                var ques = ""
                var ans = ""

                if object["timestamp"] != JSON.null {
                    var temp = object["timestamp"].string!
                    var ind = temp.index(temp.startIndex, offsetBy: 21)
                    timestamp = temp.substring(to: ind)
                }
                if object["question"] != JSON.null {
                    ques = object["question"].string!
                }
                if object["answer"] != JSON.null {
                    ans = object["answer"].string!
                }
                
                
                let myItem = questionItem(q: ques, a: ans, atTime: timestamp)
                qList.insert(myItem, at: 0)
                self.tableView.reloadData()
                //print(qList)

            }
            
        })
        rootRef.observe(.childRemoved, with: {
            snapshot in
            let object = JSON(snapshot.value!)
            
            if object["type"] == "question" {
            var place = 0;
            for i in 0...qList.count-1{
                if(qList[i].q == object["question"].string && qList[i].a == object["answer"].string && qList[i].atTime == object["timestamp"].string)
                {
                    place = i
                }
            }
            qList.remove(at: place)
            self.tableView.reloadData()
            }
            
        })

    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

 

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return qList.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "questionCell", for: indexPath) as! QuestionsTableViewCell
        if(qList.count > 0)
        {
            let data = qList[indexPath.row] as questionItem!
            cell.time.text = data!.atTime!
            cell.question.text = "Question: \(data!.q!)"
            cell.answer.text = "Answer: \(data!.a!)"
            cell.time.sizeToFit()
            cell.question.sizeToFit()
            cell.answer.sizeToFit()
            
            
            
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
