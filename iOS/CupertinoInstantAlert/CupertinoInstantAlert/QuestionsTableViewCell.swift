//
//  QuestionsTableViewCell.swift
//  CupertinoInstantAlert
//
//  Created by Gautam Ajjarapu on 4/8/17.
//  Copyright © 2017 Gautam Ajjarapu. All rights reserved.
//

import UIKit

class QuestionsTableViewCell: UITableViewCell {

    @IBOutlet weak var time: UILabel!
    
    @IBOutlet weak var question: UILabel!
    
    @IBOutlet weak var answer: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
