import 'package:flutter/material.dart';
import '../core/constants.dart';

class KhadamatiLogo extends StatelessWidget {
  final double size;
  final bool showText;
  final bool darkText;

  const KhadamatiLogo({
    super.key,
    this.size = 40,
    this.showText = true,
    this.darkText = true,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(size * 0.25),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Center(
            child: Text(
              'K',
              style: TextStyle(
                color: Colors.white,
                fontSize: size * 0.5,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ),
        if (showText) ...[
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Khadamati',
                style: TextStyle(
                  fontSize: size * 0.45,
                  fontWeight: FontWeight.w900,
                  color: darkText ? AppColors.gray900 : Colors.white,
                  letterSpacing: -0.5,
                ),
              ),
              Text(
                'خدماتي',
                style: TextStyle(
                  fontSize: size * 0.28,
                  color: darkText ? AppColors.gray400 : Colors.white70,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

// Badge de rôle
class RoleBadge extends StatelessWidget {
  final String role;
  const RoleBadge({super.key, required this.role});

  @override
  Widget build(BuildContext context) {
    final config = switch (role) {
      'ADMIN'    => (label: 'Administrateur',      bg: AppColors.dangerBg,   text: AppColors.danger),
      'RH'       => (label: 'Ressources Humaines', bg: AppColors.primaryBg,  text: AppColors.primary),
      _          => (label: 'Employé',             bg: AppColors.primaryBg,  text: AppColors.primaryLight),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: config.bg,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        config.label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: config.text,
        ),
      ),
    );
  }
}

// Carte stat
class StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const StatCard({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(label,
                  style: const TextStyle(fontSize: 12, color: AppColors.gray500, fontWeight: FontWeight.w500),
                  maxLines: 2,
                ),
              ),
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(10)),
                child: Icon(icon, color: Colors.white, size: 18),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(value,
            style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.gray900),
          ),
        ],
      ),
    );
  }
}

// Status badge
class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final config = switch (status.toUpperCase()) {
      'PENDING'     => (label: 'En attente',  bg: const Color(0xFFFEF3C7), text: const Color(0xFFD97706)),
      'APPROVED'    => (label: 'Approuvé',    bg: const Color(0xFFD1FAE5), text: const Color(0xFF059669)),
      'REJECTED'    => (label: 'Rejeté',      bg: AppColors.dangerBg,      text: AppColors.danger),
      'COMPLETED'   => (label: 'Terminé',     bg: const Color(0xFFD1FAE5), text: const Color(0xFF059669)),
      'IN_PROGRESS' => (label: 'En cours',    bg: const Color(0xFFDBEAFE), text: AppColors.primary),
      'CANCELLED'   => (label: 'Annulé',      bg: AppColors.gray100,       text: AppColors.gray500),
      _             => (label: status,         bg: AppColors.gray100,       text: AppColors.gray500),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: config.bg, borderRadius: BorderRadius.circular(20)),
      child: Text(config.label,
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: config.text),
      ),
    );
  }
}
