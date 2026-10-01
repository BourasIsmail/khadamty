# 📊 Diagrammes de Cas d'Utilisation - EmployeeHub

## Instructions Draw.io
1. Ouvrir Draw.io (https://app.diagrams.net/)
2. Fichier → Importer → Coller le code XML ci-dessous
3. Le diagramme s'affichera automatiquement

---

## 🔴 ADMINISTRATEUR - Use Case Diagram

```xml
<mxfile host="app.diagrams.net">
  <diagram name="Admin Use Cases">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- System Boundary -->
        <mxCell id="system" value="EmployeeHub System" style="swimlane;startSize=30;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="300" y="50" width="600" height="700" as="geometry"/>
        </mxCell>
        
        <!-- Admin Actor -->
        <mxCell id="admin" value="Administrateur" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="150" y="300" width="60" height="120" as="geometry"/>
        </mxCell>
        
        <!-- Use Cases Admin -->
        <mxCell id="uc1" value="S'authentifier" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="system">
          <mxGeometry x="50" y="50" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc2" value="Gérer les employés" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="130" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc3" value="Créer un employé" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="100" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc4" value="Modifier un employé" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="170" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc5" value="Supprimer un employé" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="240" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc6" value="Gérer les utilisateurs" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="210" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc7" value="Activer/Désactiver utilisateur" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="320" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc8" value="Gérer les présences" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="290" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc9" value="Créer enregistrement présence" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="390" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc10" value="Modifier présence" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="460" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc11" value="Consulter statistiques" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="370" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc12" value="Exporter rapports" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="450" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc13" value="Consulter dashboard" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="530" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc14" value="Gérer son profil" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="610" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <!-- Associations -->
        <mxCell edge="1" parent="1" source="admin" target="uc1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="admin" target="uc2">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="admin" target="uc6">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="admin" target="uc8">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="admin" target="uc11">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="admin" target="uc12">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="admin" target="uc13">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="admin" target="uc14">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
        <!-- Include relationships -->
        <mxCell edge="1" parent="system" source="uc2" target="uc3" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
          <mxCell value="&amp;lt;&amp;lt;include&amp;gt;&amp;gt;" style="edgeLabel;html=1;align=center;verticalAlign=middle;" vertex="1" connectable="0" parent="1">
            <mxGeometry relative="1" as="geometry"/>
          </mxCell>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc2" target="uc4" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc2" target="uc5" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc6" target="uc7" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc8" target="uc9" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc8" target="uc10" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 🔵 MANAGER/USER - Use Case Diagram

```xml
<mxfile host="app.diagrams.net">
  <diagram name="Manager Use Cases">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- System Boundary -->
        <mxCell id="system" value="EmployeeHub System" style="swimlane;startSize=30;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="300" y="100" width="550" height="550" as="geometry"/>
        </mxCell>
        
        <!-- Manager Actor -->
        <mxCell id="manager" value="Manager/User" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="150" y="300" width="60" height="120" as="geometry"/>
        </mxCell>
        
        <!-- Use Cases Manager -->
        <mxCell id="uc1" value="S'authentifier" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="system">
          <mxGeometry x="50" y="50" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc2" value="Consulter liste employés" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="130" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc3" value="Rechercher employé" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="100" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc4" value="Filtrer par département" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="170" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc5" value="Consulter détails employé" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="210" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc6" value="Gérer présences" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="290" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc7" value="Enregistrer présence" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="260" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc8" value="Consulter historique" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="330" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc9" value="Consulter statistiques" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="370" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc10" value="Consulter dashboard" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="450" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <!-- Associations -->
        <mxCell edge="1" parent="1" source="manager" target="uc1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="manager" target="uc2">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="manager" target="uc5">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="manager" target="uc6">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="manager" target="uc9">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="manager" target="uc10">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
        <!-- Include relationships -->
        <mxCell edge="1" parent="system" source="uc2" target="uc3" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc2" target="uc4" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc6" target="uc7" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc6" target="uc8" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 🟢 EMPLOYÉ - Use Case Diagram

```xml
<mxfile host="app.diagrams.net">
  <diagram name="Employee Use Cases">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- System Boundary -->
        <mxCell id="system" value="EmployeeHub System" style="swimlane;startSize=30;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="300" y="150" width="500" height="450" as="geometry"/>
        </mxCell>
        
        <!-- Employee Actor -->
        <mxCell id="employee" value="Employé" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="150" y="320" width="60" height="120" as="geometry"/>
        </mxCell>
        
        <!-- Use Cases Employee -->
        <mxCell id="uc1" value="S'authentifier" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="system">
          <mxGeometry x="50" y="50" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc2" value="Consulter son profil" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="130" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc3" value="Modifier informations personnelles" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="100" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc4" value="Changer mot de passe" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="170" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc5" value="Pointer entrée" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="210" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc6" value="Pointer sortie" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="290" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc7" value="Consulter ses présences" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="system">
          <mxGeometry x="50" y="370" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <mxCell id="uc8" value="Voir résumé mensuel" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="system">
          <mxGeometry x="250" y="340" width="140" height="60" as="geometry"/>
        </mxCell>
        
        <!-- Associations -->
        <mxCell edge="1" parent="1" source="employee" target="uc1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="employee" target="uc2">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="employee" target="uc5">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="employee" target="uc6">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="1" source="employee" target="uc7">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
        <!-- Include relationships -->
        <mxCell edge="1" parent="system" source="uc2" target="uc3" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc2" target="uc4" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell edge="1" parent="system" source="uc7" target="uc8" style="dashed=1;endArrow=open;endFill=0;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 📋 Tableau Récapitulatif des Cas d'Utilisation

| Acteur | Cas d'Utilisation Principaux | Nombre |
|--------|------------------------------|--------|
| **Administrateur** | Gestion complète (employés, users, présences, stats) | 14 |
| **Manager/User** | Consultation + gestion présences | 10 |
| **Employé** | Profil + pointage + consultation | 8 |

## 🎨 Légende des Couleurs

- 🟡 **Jaune** : Authentification
- 🟢 **Vert** : Cas d'utilisation principaux
- 🟣 **Violet** : Cas d'utilisation inclus (<<include>>)
- 🔴 **Rouge** : Acteur Administrateur
- 🔵 **Bleu** : Acteur Manager
- 🟢 **Vert** : Acteur Employé

---

## 📥 Utilisation

1. Copier le code XML d'un acteur
2. Ouvrir Draw.io → Fichier → Importer depuis → Texte
3. Coller le code
4. Le diagramme s'affiche automatiquement !
