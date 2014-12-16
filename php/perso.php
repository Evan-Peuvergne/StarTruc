<?php

	/* 
		PERSO
		********************
		DESC | Access to characters informations and udpating methods
	*/


		/* CONFIG */

			// Database
			require('rb.php');
			R::setup('mysql:host=localhost;dbname=starwars','root','root');

			// JSON headers
			header('Cache-Control: no-cache, must-revalidate');
			header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
			header('Content-type: application/json');


		/* ROUTING */

			// Capture action
			switch($_GET['action']){
				case "get-all-names":
					if(isset($_POST['search'])){
						getAllPersos($_POST['search']);
					}else{
						getAllPersos();
					}
				break;
				case "get-one":
					getPerso($_POST['id']);
				break;
				case "get-results":
					getPersoResults($_POST['id']);
				break;
				case "get-ranking":
					if(isset($_POST['ranking'])){
						getPersoRanking($_POST['id'], $_POST['rank']);
					}else{
						getPersoRanking($_POST['id']);
					}
				break;
				case "set-battle-result":
					setBattleResult($_POST['id1'], $_POST['id2'], $_POST['charisma'], $_POST['fight'], $_POST['intellect'], $_POST['force']);
				break;
			}

			// Close  database connexion
			R::close();


		/* METHODS */


			/* Querying */

				/* Get all persos */

				function getAllPersos ($search = null)
				{
					// Set search
					if(!$search){ $search = ""; }
					$search = "%".$search."%";

					// Get all persos
					$persos = R::getAll("SELECT * FROM persos WHERE name LIKE :search", [':search' => $search]);

					// Send response
					print_r(json_encode($persos));
				}

				/* Get perso informations */

				function getPerso($id)
				{
					// Get perso
					$perso = R::findOne('persos', 'id='.$id);

					// Send response
					print_r(json_encode(R::exportAll($perso)));
				}

				/* Get perso results */

				function getPersoResults ($id)
				{
					// Get perso
					$perso = R::findOne('persos', 'id='.$id);

					// Get min and max values
					$max = array(
						"main" => abs(R::getCol("SELECT MAX(global) FROM persos")[0]),
						"charisma" => abs(R::getCol("SELECT MAX(charisma) FROM persos")[0]),
						"fight" => abs(R::getCol("SELECT MAX(fight) FROM persos")[0]),
						"intellect" => abs(R::getCol("SELECT MAX(intellect) FROM persos")[0]),
						"strength" => abs(R::getCol("SELECT MAX(strength) FROM persos")[0])
					);

					// Get caracteristics float value
					$scores = array(
						"main" => abs($perso->global*100/$max["main"]),
						"charisma" => abs($perso->charisma*100/$max["charisma"]),
						"fight" => abs($perso->fight*100/$max["fight"]),
						"intellect" => abs($perso->intellect*100/$max["intellect"]),
						"strength" => abs($perso->strength*100/$max["strength"]),
					);

					print(json_encode($scores));
				}

				/* Get perso ranking */

				function getPersoRanking ($id, $ranking = null)
				{
					// Set rank
					if(!$ranking){ $ranking = "global"; }

					// Get podium
						$query = sprintf("ORDER BY %s DESC LIMIT 2", $ranking);
						$podium = R::exportAll(R::findAll('persos', $query));

					// Get perso ranking
					$perso = R::getRow("SELECT *, FIND_IN_SET( global, ( SELECT GROUP_CONCAT( global ORDER BY global DESC ) FROM persos )) AS rank FROM persos WHERE id = '1'");
					
					// Send response
					print(json_encode(array(
						"podium" => $podium,
						"perso" => $perso
					)));
				}


			/* Udpating */

			function setBattleResult ($id1, $id2, $charisma, $fight, $intellect, $force)
			{
				// Get persos
				$perso1 = R::findOne('persos', 'id='.$id1);
				$perso2 = R::findOne('persos', 'id='.$id2);
				
				// Set caracteristics
				if($charisma >= -100 && $charisma <= 100){ $perso1->charisma = $perso1->charisma + $charisma; $perso2->charisma = $perso2->charisma + (-$charisma); }
				if($fight >= -100 && $fight <= 100){ $perso1->fight = $perso1->fight + $fight; $perso2->fight = $perso2->fight + (-$fight); }
				if($intellect >= -100 && $intellect <= 100){ $perso1->intellect = $perso1->intellect + $intellect; $perso2->intellect = $perso2->intellect + (-$intellect); }
				if($force >= -100 && $force <= 100){ $perso1->force = $perso1->force + $force; $perso2->force = $perso2->force + (-$force); }
				
				// Global score
				$perso1->global = intval(($perso1->charisma + $perso1->fight + $perso1->intellect + $perso1->force)/4);
				$perso2->global = intval(($perso2->charisma + $perso2->fight + $perso2->intellect + $perso2->force)/4);

				// Update battles counter
				$perso1->battles++;
				$perso2->battles++;

				// Save
				R::store($perso1);
				R::store($perso2);

				// Send response
				print_r(json_encode(array(
					"success" => true
				)));
			}

?>