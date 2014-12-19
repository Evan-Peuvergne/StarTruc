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
				case "get-perso-ranking":
					if(isset($_POST['ranking'])){
						getPersoRanking($_POST['id'], $_POST['rank']);
					}else{
						getPersoRanking($_POST['id']);
					}
				break;
				case "get-ranking":
					getRanking($_POST["side"], $_POST["skill"]);
				break;
				case "set-battle-result":
					setBattleResult($_POST['id1'], $_POST['id2'], $_POST['results']);
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
					$persos = R::getAll("SELECT id, name, description, photos FROM persos WHERE name LIKE :search", [':search' => $search]);

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

				/* Get general ranking */

				function getRanking ($side, $skill)
				{
					// Managin side
					if($side != "*"){
						$ranks = R::getAll("SELECT name, photos, global, fight, intellect, strength, charisma FROM persos WHERE side = :side ORDER BY ".$skill." desc", [':side' => $side]);
					}else{
						$ranks = R::getAll("SELECT name, photos, global, fight, intellect, strength, charisma FROM persos ORDER BY ".$skill." desc");
					}
					print_r(json_encode($ranks));
				}


			/* Udpating */

			function setBattleResult ($id1, $id2, $results)
			{
				// Get persos
				$perso1 = R::findOne('persos', 'id='.$id1);
				$perso2 = R::findOne('persos', 'id='.$id2);

				// print_r(json_encode($results));
				
				// Set new caracteristics for perso1
				$perso1->fight = average($perso1->fight, $results["fight"][0], $perso1->battles);
				$perso1->intellect = average($perso1->intellect, $results["intellect"][0], $perso1->battles);
				$perso1->strength = average($perso1->strength, $results["strength"][0], $perso1->battles);
				$perso1->charisma = average($perso1->charisma, $results["charisma"][0], $perso1->battles);
				$perso1->global = average($perso1->global, $results["global"][0], $perso1->battles);

				// Set new caracteristics for perso2
				$perso2->fight = average($perso2->fight, $results["fight"][1], $perso2->battles);
				$perso2->intellect = average($perso2->intellect, $results["intellect"][1], $perso2->battles);
				$perso2->strength = average($perso2->strength, $results["strength"][1], $perso2->battles);
				$perso2->charisma = average($perso2->charisma, $results["charisma"][1], $perso2->battles);
				$perso2->global = average($perso2->global, $results["global"][1], $perso2->battles);

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

			function average($old, $new, $ratio){
				return (($old*$ratio)+$new)/($ratio+1);
			}

?>